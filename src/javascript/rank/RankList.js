import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import { fetch } from '../redux/actions';

import { api, service, columns, path } from '../commons/configs';

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
    resetList : () => dispatch(fetch.resetList()),
    getList: (url, params) => dispatch(fetch.list(url, params)),
    move: (location) => dispatch(push(location)),
});

class RankList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            year : null,
        };
    }

    componentWillMount() {
        this.props.resetList();
    }

    search(params) {
        this.props.move(path.list(path.rank, {...this.getParamsFormLocation(), ...params}));
    }

    componentDidMount(){
        this.getList(this.getParamsFormLocation());
    }

    componentDidUpdate(prevProps) {
        const {location} = this.props;
        if(prevProps.location.search !== location.search) {
            this.getList(this.getParamsFormLocation())
        }
    }

    getList(searchParams){
        const { from } = this.props;
        const obj = from === 'user' ? api.userRankList(...searchParams, this.state) : null;

        return this.props.getList(obj, {});
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
        // TODO 서버의 리스트 스키마가 변경되면 리스트 갯수맞추기 다시 해야됨
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
