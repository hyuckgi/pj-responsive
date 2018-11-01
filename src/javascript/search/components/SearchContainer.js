import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { service, api, path } from '../../commons/configs';
import { fetch } from '../../redux/actions';

import { Flex } from 'antd-mobile';
import { Avatar, Tag } from 'antd';
import { SearchBox } from './';

const getFlat = (list, parent= null) => {
    if(!Array.isArray(list)){
        return;
    }
    return list.reduce((result, item) => {
        if(item.children){
            result = result.concat(getFlat(item.children, item));
        }else{
            parent ? result.push({parent :parent.value, ...item}) : result.push(item)
        }
        return result;
    }, [])
};

const mapStateToProps = ({code, fetch}) => {
    const categories = service.getValue(code, 'categories', []);
    const hashTags = service.getValue(fetch, 'multipleList.hashTags.list', []);
    const categoryList = getFlat(categories);

    return {
        categoryList,
        hashTags,
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class SearchContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            size : 100,

            colors : [],
        }

        this.onEvents = this.onEvents.bind(this);
        this.renderCategory = this.renderCategory.bind(this);

        this.getHashTag = this.getHashTag.bind(this);
        this.renderTag = this.renderTag.bind(this);
        this.generateColor = this.generateColor.bind(this);

        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        this.getHashTag();
        this.generateColor();
    }

    getHashTag(){
        const { page, size } = this.state;
        const { hashTags } = this.props;

        if(hashTags.length){
            return;
        }

        const obj = api.getHash(page, size);
        return this.props.multipleList([
            {id : 'hashTags', url : obj.url, params : {}}
        ]);
    }

    onSearch(keyword){
        return this.props.move(`${path.result}?keyword=${keyword}`);
    }

    onEvents(params){
        console.log("params", params);
        const { events } = params;

        switch (events) {
            case 'search':
                return this.onSearch(service.getValue(params, 'payload.keyword', ''))
            default:
                break;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(service.getValue(prevProps, 'hashTags.length') !== service.getValue(this.props, 'hashTags.length')){
            this.generateColor();
        }
    }

    generateColor () {
        const { hashTags } = this.props;
        const colors = hashTags.reduce((result, item) => {
            item = `#${Math.random().toString(16).substr(-6)}`;
            result.push(item);
            return result;
        }, []);

        return this.setState({
            colors
        });
    }

    onMove(params){
        return this.props.move(path.moveParams(path.storyList, 'all', params));
    }

    onClickCate(item, e){
        e && e.preventDefault();
        const cateNo = service.getValue(item, 'parent', false) ? `${service.getValue(item, 'parent')}/${service.getValue(item, 'categoryNo')}` : service.getValue(item, 'categoryNo', false);
        if(cateNo){
            return this.onMove({category : cateNo});
        }
    }

    onClickTag(item, e){
        e && e.preventDefault();
        if(!Object.keys(item).length){
            return;
        }

        return this.onMove({hashtag : item.tag});
    }

    renderCategory(){
        const { categoryList } = this.props;
        const size = service.isMobile() ? 40 : 98;

        return (
            <Flex wrap="wrap">
                {categoryList.map((item, idx) => {
                    return (
                        <Flex.Item key={idx} onClick={this.onClickCate.bind(this, item)}>
                            <Avatar size={size} icon="user"/>
                            <p>{service.getValue(item, 'categoryName', '')}</p>
                        </Flex.Item>
                    )
                })}
            </Flex>
        )
    }

    renderTag(){
        const { colors } = this.state;
        const { hashTags } = this.props;

        if(!hashTags.length || !colors.length){
            return null;
        }

        return hashTags.map((item, idx) => {
            return (<Flex.Item key={idx} onClick={this.onClickTag.bind(this, item)}><Tag color={colors[idx]}>{`#${item.tag}`}</Tag></Flex.Item>)
        })
    }

    render() {
        return (
            <div className="search-container">
                <SearchBox onEvents={this.onEvents}/>

                <Flex direction="column" wrap="wrap" className="search-wrap category-wrap" align="stretch">
                    <Flex.Item className="title">
                        카테고리 찾기
                    </Flex.Item>
                    <Flex.Item className="list">
                        {this.renderCategory()}
                    </Flex.Item>
                </Flex>

                <Flex direction="column" wrap="wrap" className="search-wrap tag-wrap" align="stretch">
                    <Flex.Item className="title">
                        태그로 찾기
                    </Flex.Item>
                    <Flex.Item className="list">
                        <Flex wrap="wrap">
                            {this.renderTag()}
                        </Flex>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(SearchContainer);
