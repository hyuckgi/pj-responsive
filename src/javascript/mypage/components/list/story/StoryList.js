import React from 'react';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetch } from '../../../../redux/actions';

import { api, service, columns, path, values } from '../../../../commons/configs';
import { TableList } from '../../../../commons/components';

import { Avatar, Select } from 'antd';
import { Flex } from 'antd-mobile';

const Option = Select.Option;
const statusOptions = service.getValue(values, 'story.options', []);

const mapStateToProps = ({fetch}) => {
    const userInfo = service.getValue(fetch, 'item.data', {});
    const resultObj = service.getValue(fetch, 'multipleList.myStoriyList', {});
    const list = service.getValue(resultObj, 'list', []);
    const dataSource = list.map((item, inx) => {
        item = {
            ...item,
            key : inx,
            inx : inx + 1,
        }
        return item;
    });
    const makeSource = {count : service.getValue(resultObj, 'totalSize', list.length), results : dataSource, pageSize : service.getValue(resultObj, 'size', 10) };
    const data = service.makeList(makeSource);

    return {
        data,
        userInfo
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
            size : 30,
            page : 1,
            status : 0,
        };

        this.getList = this.getList.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.onEvents = this.onEvents.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    search(params) {
        const type = service.getValue(this.props, 'match.params.type', false);

        if(type){
            this.props.move(path.fullList(`${path.mypageList}/${type}`, {...params}));
        }
    }

    componentWillMount() {
        const { location } = this.props;
        const { page, size } = this.state;

        if(location.search){
            return this.search(this.getParamsFormLocation())
        }
        return this.search({size, page});
    }

    componentDidUpdate(prevProps, prevState) {
        const { location } = this.props;
        if(prevProps.location.search !== location.search){
            this.getList(this.getParamsFormLocation());
        }

        if(Object.keys(this.props.userInfo).length > 0 && service.getValue(prevProps, 'userInfo.userNo', 0) !== service.getValue(this.props, 'userInfo.userNo', 0)){
            this.getList(this.getParamsFormLocation())
        }
    }

    getList(searchParams){
        const { status } = this.state;
        const userNo = service.getValue(this.props, 'userInfo.userNo', false);

        if(!userNo){
            return;
        }
        const params = {status : status, userNo :userNo };
        const obj = api.getMyStory({...searchParams, params});

        return this.props.multipleList([
            {id : 'myStoriyList', url : obj.url, params : obj.params},
        ])
    }

    getParamsFormLocation(){
        const { location } = this.props;
        return service.toSearchParams(location.search);
    }

    getColumns(columns){
        return columns.map(column => {
            if(column.dataIndex === 'imageUrl'){
                column.render = (text, item) => {
                    const src = service.getValue(item, 'imageUrl', false);

                    return (<span>{src ? (<Avatar src={src} style={{marginRight: 15}}/>) : null}</span>)
                }
            }

            if(column.dataIndex === 'status'){
                column.render = (text, item) => {
                    const current = statusOptions.filter(item => item.value === Number(text)).find(item => item);
                    return service.getValue(current, 'label', text);
                }
            }
            return column;
        });
    }

    onEvents(params){
        const { events, payload } = params;

        switch (events) {
            case 'change':
                return this.search(payload)
            default:
                break;
        }
    }

    onSelect(value){
        this.setState({
            status : value,
        }, () => {
            return this.getList(this.getParamsFormLocation());
        });
    }

    renderSelect(){

        return (
            <Select
                ref='select'
                defaultValue="전체"
                onSelect={this.onSelect}
                style={{ minWidth: 150 }}
            >
                {statusOptions.map((item, inx) => {
                    return (
                        <Option
                            key={item.value}
                            title={item.label}
                            value={item.value}
                        >{item.label}</Option>
                    )
                })}
            </Select>
        )
    }

    render() {
        const { data } = this.props;

        return (
            <div className="list-wrap">
                <Flex justify="between" className="list-wrap-top">
                    <Flex.Item >
                        <h3>스토리 제안 내역 {`${data.total && data.total} 건`}</h3>
                    </Flex.Item>
                    <Flex.Item style={{textAlign : 'right'}}>
                        {this.renderSelect()}
                    </Flex.Item>
                </Flex>
                <TableList
                    data={data}
                    columns={this.getColumns(columns.myProposeList)}
                    onEvents={this.onEvents}
                />
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SupportList));
