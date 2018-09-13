import React from 'react';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetch } from '../../../../redux/actions';

import { api, service, columns, path } from '../../../../commons/configs';
import { TableList } from '../../../../commons/components';

import { Avatar } from 'antd';

const mapStateToProps = ({fetch}) => {

    const list = service.getValue(fetch, 'multipleList.rankList.list', []);
    const dataSource = list.map((item, inx) => {
        item = {
            ...item,
            key : inx,
            inx : inx + 1,
        }
        return item;
    });
    const makeSource = {count : list.length, results : dataSource };
    const data = service.makeList(makeSource);

    return {
        data
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    move: (location) => dispatch(push(location)),
});


class SupportList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            year : null,
        };

        this.getData = this.getData.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.onEvent = this.onEvent.bind(this);
    }

    search(params) {
        this.props.move(path.list(path.rankList, {...this.getParamsFormLocation(), ...params}));
    }

    componentDidMount() {
        this.getData(this.getParamsFormLocation());
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if(prevProps.match.params.type !== this.props.match.params.type){
    //         this.getData(this.getParamsFormLocation());
    //     }
    // }

    getData(searchParams){
        return this.props.multipleList([
            {id : 'supportList', url : api.getUserHistory({...searchParams, ...this.state}), params : {}},
        ])
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     if(nextProps.location.pathname !== this.props.location.pathname){
    //         this.setState({
    //             year : null
    //         })
    //     }
    // }

    getParamsFormLocation(){
        const { location } = this.props;
        return service.toSearchParams(location.search);
    }

    getColumns(columns){
        return columns.map(column => {
            if(column.dataIndex === 'thumbnailUrl'){
                column.render = (text, item) => {
                    const src = service.getValue(item, 'thumbnailUrl', false);

                    return (<span>{src ? (<Avatar src={src} style={{marginRight: 15}}/>) : null}</span>)
                }
            }
            return column;
        });
    }

    onEvent(params){
        const { events, payload } = params;

        switch (events) {
            case 'year':
                return this.setState({
                    year : payload.year
                }, () => {
                    return this.getData(this.getParamsFormLocation());
                })
            default:
                break;
        }
    }

    render() {
        const { data } = this.props;
        // const options = service.makeYearOption();

        return (
            <div className="support-list">
                <TableList
                    data={data}
                    columns={this.getColumns(columns.donationList)}
                    onEvent={this.onEvent}
                />
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SupportList));
