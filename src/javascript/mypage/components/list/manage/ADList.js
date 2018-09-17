import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { fetch } from '../../../../redux/actions';

import { api, service, columns, path, values } from '../../../../commons/configs';
import { FormMode } from '../../../../commons/types';

import { Flex, Button, List, Modal } from 'antd-mobile';

import { ADItem } from './';

const mapStateToProps = ({fetch}) => {
    const resultObj = service.getValue(fetch, 'multipleList.ADList', {});
    const list = service.getValue(resultObj, 'list', []);

    return {
        resultObj,
        list
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class ADList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page : 1,
            size : 10,

        }

        this.getList = this.getList.bind(this);
        this.renderList = this.renderList.bind(this);
        this.renderHeader = this.renderHeader.bind(this);

        this.onEvents = this.onEvents.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    getList(){
        const { page, size } = this.state;
        return this.props.multipleList([{id : 'ADList', url : api.getADList({page, size}), params : {}}])
    }

    onEvents(...args){
        console.log("args", args);
    }

    renderList(){
        const { list } = this.props;

        if(!list.length){
            return(
                <List.Item wrap className="list-none">
                    <p>등록된 광고가 없습니다.</p>
                    <p>광고를 등록해 주세요.</p>
                    <p className="last">광고는 최대 10개까지만 등록하여 사용하실 수 있습니다.</p>
                </List.Item>
            )
        }

        return list.map((item, idx) => {
            return(<ADItem key={idx} item={item} onEvents={this.onEvents} mode={FormMode.READ}/>)
        })
    }

    renderHeader(){
        const { list } = this.props;

        return(
            <List.Item
                extra={(<Button inline type="primary">광고등록</Button>)}
                align="middle"
            >
                등록된 광고 : {`${service.getValue(list, 'length', 0)} / 10`}
            </List.Item>
        )
    }

    render() {
        return (
            <div className="list-wrap ad-wrap">
                <List
                    className="ad-list"
                    renderHeader={this.renderHeader}
                >
                    {this.renderList()}
                </List>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(ADList);
