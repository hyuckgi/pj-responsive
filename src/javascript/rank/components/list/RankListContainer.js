import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetch } from '../../../redux/actions';

import { api, service, columns, path } from '../../../commons/configs';

import { ListTop, List } from '../common';

import { Avatar } from 'antd';

const mapStateToProps = ({fetch}) => {
    const ranks = service.getValue(fetch, 'multipleList.rankTop.data', {});

    const list = service.getValue(fetch, 'multipleList.rankList.list', []);
    const dataSource = list.map((item, inx) => {
        item = {
            ...item,
            key : inx,
            inx : inx + 1,
        }
        return item;
    });

    const currentPage = service.getValue(fetch, 'multipleList.rankList.page', 1);
    const makeSource = {count : list.length, results : dataSource };
    const data = service.makeList(makeSource);

    return {
        data,
        ranks,
        currentPage
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    move: (location) => dispatch(push(location)),
});


class RankListContainer extends React.Component {

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

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.type !== this.props.match.params.type){
            this.getData(this.getParamsFormLocation());
        }
    }

    getData(searchParams){
        const type = service.getValue(this.props, 'match.params.type', 'user');
        const flag = type === 'user' ? 'donate' : 'sponsor';

        return this.props.multipleList([
            {id : 'rankTop', url : api.getRank(flag), params : {}},
            {id : 'rankList', url : api.getRankList({type : flag, ...searchParams, ...this.state}), params : {}},
        ])
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.location.pathname !== this.props.location.pathname){
            this.setState({
                year : null
            })
        }
    }

    getParamsFormLocation(){
        const { location } = this.props;
        return service.toSearchParams(location.search);
    }

    getColumns(columns){
        return columns.map(column => {
            if(column.dataIndex === 'userId'){
                column.render = (text, item) => {
                    const src = service.getValue(item, 'thumbnailUrl', false);

                    return (<span>{src ? (<Avatar src={src} style={{marginRight: 15}}/>) : null} {text}</span>)
                }
            }
            if(column.dataIndex === 'username'){
                column.render = (text, item) => {
                    const src = service.getValue(item, 'profileUrl', false);

                    return (<span>{src ? (<Avatar src={src} style={{marginRight: 15}}/>) : null} {text}</span>)
                }
            }
            return column;
        });
    }

    onEvent(params){
        const { events, payload } = params;

        // TODO 리스트 pagination
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
        const { ranks, match, data } = this.props;
        const type = service.getValue(match, 'params.type', 'user');
        const title = type === 'user' ? '기부 랭킹' : '스폰서 랭킹';
        const options = service.makeYearOption();

        return (
            <div className={`rank-wrapper ${type}-rank-wrapper`}>
                {Object.keys(ranks).length > 0 &&  (<ListTop item={ranks} type={type} />)}
                <List
                    selectOptions={options}
                    data={data}
                    title={title}
                    columns={this.getColumns(columns[`${type}RankList`])}
                    onEvent={this.onEvent}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(RankListContainer);
