import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Button, List, Modal } from 'antd-mobile';

import { path, service } from '../../configs';

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
    move: (location) => dispatch(push(location)),
});

class ADList extends React.Component {

    constructor(props) {
        super(props);

        this.renderList = this.renderList.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e){
        e && e.preventDefault();
        console.log("obj");
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
            return(<ADItem key={idx} item={item} onEvents={this.onEvents} />)
        })
    }

    renderHeader(){
        const { list } = this.props;

        return(
            <List.Item
                extra={(<Button inline type="primary" onClick={this.onClick}>새로운 광고 등록</Button>)}
                align="middle"
            >
                등록된 광고 : {`${service.getValue(list, 'length', 0)} / 10`}
            </List.Item>
        )
    }

    render() {
        return (
            <div className="ad-wrap">
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
