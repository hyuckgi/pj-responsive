import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetch } from '../redux/actions';

import { api, service, columns } from '../commons/configs';

import { DesktopLayout, MobileLayout } from '../commons/components';
import { Table } from 'antd';

const noData = '-';
const rankColumns = columns.rankColumns;

const mapStateToProps = ({fetch}) => {
    const list = service.getValue(fetch, 'list.list', []);

    console.log("list", list);
    const dataSource = list.length > 0 && Object.keys(list[0]).map((item, inx) => {
        list[0][item] = {
            ...list[0][item],
            key : inx,
            inx : inx + 1,
        }
        return list[0][item];
    });

    console.log("dataSource", dataSource);
    const currentPage = service.getValue(fetch, 'list.page', 1);
    const makeSource = {count : 5, results : dataSource };
    const data = service.makeList(makeSource);

    return {
        data,
        currentPage
    }
};

const mapDispatchProps = dispatch => ({
    getList: (url, params) => dispatch(fetch.list(url, params)),
});

class RankList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            year : null,
        };
    }

    componentDidMount() {
        this.getList(this.getParamsFormLocation());
    }

    getList(searchParams){
        const { from } = this.props;
        const obj = from === 'user' ? api.userRankList(...searchParams, this.state) : null;

        return this.props.getList(obj, {})


        // return this.props.getList(obj, {})


        console.log("obj", obj);
    }

    getRowKey(record){
        return record.key;
    }

    getParamsFormLocation(){
        const {location} = this.props;
        return service.toSearchParams(location.search);
    }

    getColumns(columns){
        return columns.map(column => {
            return column;
        })
    }

    onChange(...args) {
        console.log("onChange", args);
        // const limit = pagination.pageSize;
        // const params = {limit, offset: (pagination.current - 1) * limit};
        // this.search(params);
    }

    render() {
        const { data, currentPage } = this.props;
        const { list, pagination } = data;
        pagination.current = currentPage || 1;


        return (
            <div className="rank-list">
                <DesktopLayout>
                    <Table
                        columns={this.getColumns(rankColumns)}
                        dataSource={list}
                        pagination={pagination}
                        rowKey={this.getRowKey}
                        onChange={this.onChange.bind(this)}
                    />
                </DesktopLayout>
                <MobileLayout>
                    mobile...wait
                </MobileLayout>
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RankList));
