import React from 'react';
import { connect } from 'react-redux';

import { api, service } from '../../../configs';
import { fetch } from '../../../../redux/actions';

import { List } from 'antd-mobile';
import { ListItem } from './';

const mapStateToProps = ({fetch}) => {
    const list = service.getValue(fetch, 'multipleList.accountList.list', []);

    return {
        list,
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class AccountList extends React.Component {

    constructor(props) {
        super(props);

        this.getList = this.getList.bind(this);
        this.renderList = this.renderList.bind(this);
        this.onEvents = this.onEvents.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    getList(){
        this.props.multipleList([
            {id : 'accountList', url : api.accountList(), params : {}},
        ])
    }

    onEvents(params){
        const { events } = params;
        switch (events) {
            case 'update':
                return this.getList();
            default:
                break;
        }
    }

    renderList(){
        const { list } = this.props;

        if(!list.length){
            return(
                <List.Item wrap className="list-none">
                    <p>등록된 계좌가 없습니다.</p>
                    <p>자주쓰는 계좌를 등록해 주세요.</p>
                    <p className="last">자주쓰는 계좌는 최대 5개까지만 등록하여 사용하실 수 있습니다.</p>
                </List.Item>
            )
        }

        return list.map((item, idx) => {
            return(<ListItem key={idx} item={item} onEvents={this.onEvents}/>)
        })
    }

    render() {
        return (
            <div className="list-wrap account-wrap">
                <List
                    className="account-list"
                >
                    {this.renderList()}
                </List>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(AccountList);
