import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

import { fetch } from '../../../redux/actions';
import { api, service, columns, values, path } from '../../../commons/configs';

import { List } from '../common';
import { Avatar } from 'antd';

const donationList = columns.donationList;

const mapStateToProps = ({fetch}) => {
    const resultObj = service.getValue(fetch, 'multipleList.donationList', {});
    const list = service.getValue(resultObj, 'list', []);
    const dataSource = list.length && list.map((item, inx) => {
        item = {
            ...item,
            key : inx,
            inx : inx + 1,
            donateDate : moment(item.donateDate, values.format.DATE_FORMAT).format(values.format.DATE_FORMAT)
        }
        return item;
    });

    const makeSource = {
        count : service.getValue(resultObj, 'totalSize', list.length),
        results : dataSource,
        pageSize : service.getValue(resultObj, 'size', 10),
        current : service.getValue(resultObj, 'page', 10)
    };
    const data = service.makeList(makeSource);

    return {
        data
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    move: (location) => dispatch(push(location)),
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

        this.search = this.search.bind(this);

        this.getList = this.getList.bind(this);
        this.onEvents = this.onEvents.bind(this);
    }

    search(params) {
        // const type = service.getValue(this.props, 'match.params.type', false);
        //
        // if(type){
        //     this.props.move(path.fullList(`${path.rankList}/${type}`, {...params}));
        // }
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

    onEvents(params){

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
            if(column.dataIndex === 'thumbnailUrl'){
                column.render = (text, item) => {
                    if(text){
                        return (<Avatar src={text} style={{marginRight : 15}}/>)
                    }
                    return null;
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
                onEvents={this.onEvents}
            />
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DonationList));
