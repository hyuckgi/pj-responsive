import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { service, api, path } from '../../commons/configs';
import { fetch } from '../../redux/actions';

import { Flex } from 'antd-mobile';
import { Avatar } from 'antd';
import { SearchBox, HashTag } from './';

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
    const hashTags = service.getValue(fetch, 'list.list', []);
    const categoryList = getFlat(categories);

    return {
        categoryList,
        hashTags,
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
    getList: (list, params) => dispatch(fetch.list(list, params)),
});

class SearchContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            size : 100,
        }

        this.onEvents = this.onEvents.bind(this);
        this.renderCategory = this.renderCategory.bind(this);

        this.getHashTag = this.getHashTag.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        this.getHashTag();
    }

    getHashTag(){
        const { page, size } = this.state;
        const { hashTags } = this.props;

        if(hashTags.length){
            return;
        }

        const obj = api.getHash(page, size);
        return this.props.getList(obj.url, obj.params);
    }

    onSearch(keyword){
        return this.props.move(`${path.result}?keyword=${keyword}`);
    }

    onEvents(params){
        const { events } = params;

        switch (events) {
            case 'search':
                return this.onSearch(params.payload.keyword)
            case 'hash' :
                return this.onMove(params.payload);
            default:
                break;
        }
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

    render() {
        const { hashTags } = this.props;

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

                <HashTag title="태그로 찾기" onEvents={this.onEvents} tags={hashTags}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(SearchContainer);
