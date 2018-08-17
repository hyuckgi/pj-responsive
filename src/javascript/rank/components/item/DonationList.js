import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetch } from '../../../redux/actions';
import { api, service, columns, path, values } from '../../../commons/configs';

import { List } from '../common';
import { Avatar } from 'antd';

const donationList = columns.donationList;

const mapStateToProps = ({fetch}) => {
    const res = service.getValue(fetch, 'multipleList.donationList', {});
    const list = service.getValue(res, 'list', []);
    const dataSource = list.length && list.map((item, inx) => {
        item = {
            ...item,
            key : inx,
            inx : inx + 1,
            donateDate : moment(item.donateDate, values.format.DATE_FORMAT).format(values.format.DATE_FORMAT)
        }
        return item;
    });

    const currentPage = service.getValue(fetch, 'multipleList.donationList.page', 1);
    const makeSource = {count : list.length, results : dataSource };
    const data = service.makeList(makeSource);

    return {
        data,
        currentPage
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});


class DonationList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            year : null,
            page : 1,
            size : 10,
            userNo : service.getValue(this.props, 'match.params.id', false)
        };

        this.getList = this.getList.bind(this);
        this.onEvent = this.onEvent.bind(this);
    }

    componentDidMount() {
        this.getList()
    }

    getList(){
        return this.props.multipleList([
            {id : 'donationList', url : api.getUserHistory({...this.state}), params : {}}
        ]);
    }

    componentDidUpdate(prevProps, prevState) {
        const prevId = service.getValue(prevProps, 'match.params.id', false);
        const currentId = service.getValue(this.props, 'match.params.id', false);
        if(prevId !== currentId){
            return this.getList(currentId);
        }
    }

    onEvent(params){

        console.log("params", params);
        // TODO 리스트 pagination
        const { events, payload } = params;
        switch (events) {
            case 'year':
                return this.setState({
                    year : payload.year
                }, () => {
                    return this.getList();
                });
            case 'change':
                return this.setState({
                    size : payload.size,
                    page : payload.page
                }, () => {
                    return this.getList();
                });
            default:
                break;
        }

    }

    getColumns(columns){
        return columns.map(column => {
            if(column.dataIndex === 'storyTitle'){
                column.render = (text, item) => {
                    const src = service.getValue(item, 'thumbnailUrl', false);
                    return (<span>{src ? <Avatar src={src} style={{marginRight : 15}}/> : null }{text}</span>)
                }
            }
            return column;
        });
    }

    render() {
        const { data } = this.props;
        const { size } = this.state;
        const { pagination } = data;
        pagination.defaultPageSize = size;

        const options = service.makeYearOption();

        return (
            <List
                size="middle"
                selectOptions={options}
                data={data}
                title='기부내역'
                columns={this.getColumns(donationList)}
                onEvent={this.onEvent}
            />
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DonationList));