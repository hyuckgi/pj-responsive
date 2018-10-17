import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { service } from '../../commons/configs';

import { Flex } from 'antd-mobile';
import { Avatar, Tag } from 'antd';
import { SearchBox } from './';

const colorList = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
];

const getFlat = (list) => {
    if(!Array.isArray(list)){
        return;
    }
    return list.reduce((result, item) => {
        if(item.list){
            result = result.concat(getFlat(item.list));
        }else{
            result.push(item);
        }

        return result;
    }, [])
};

const mapStateToProps = ({code, fetch}) => {
    const categories = service.getValue(code, 'categories', []);
    const categoryList = getFlat(categories);

    return {
        categoryList
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class SearchContainer extends React.Component {

    constructor(props) {
        super(props);

        this.onEvents = this.onEvents.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.renderCategory = this.renderCategory.bind(this);
    }

    onSubmit(keyword){
        console.log("keyword", keyword);
    }

    onEvents(params){
        console.log("params", params);
        const { events } = params;

        switch (events) {
            case 'search':
                return this.onSubmit(service.getValue(params, 'payload.keyword', ''))
            default:
                break;
        }
    }

    onClick(item, e){
        e && e.preventDefault();
        const cateNo = service.getValue(item, 'value', false);

        if(cateNo){
            console.log("cateNo", cateNo);
        }
    }

    onClickTag(item, e){
        e && e.preventDefault();
        console.log('item', item);
    }

    renderCategory(){
        const { categoryList } = this.props;
        const size = service.isMobile() ? 40 : 98;

        return (
            <Flex wrap="wrap">
                {categoryList.map((item, idx) => {
                    return (
                        <Flex.Item key={idx} onClick={this.onClick.bind(this, item)}>
                            <Avatar size={size} icon="user"/>
                            <p>{service.getValue(item, 'categoryName', '')}</p>
                        </Flex.Item>
                    )
                })}
            </Flex>
        )
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
                        <Flex>
                            {colorList.map((item, idx) => {
                                return (<Flex.Item key={idx} onClick={this.onClickTag.bind(this, item)}><Tag color={item}>{item}</Tag></Flex.Item>)
                            })}
                        </Flex>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(SearchContainer);
