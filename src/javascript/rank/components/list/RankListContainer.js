import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetch } from '../../../redux/actions';

import { api, service, columns, path } from '../../../commons/configs';

import { ListTop, List } from '../common';

const noData = '-';
const rankColumns = columns.rankColumns;

const mapStateToProps = ({fetch}) => {
    const ranks = service.getValue(fetch, 'multipleList.rankTop.data', {});

    //TODO 리스트 정교화
    const list = service.getValue(fetch, 'multipleList.rankList.list', []);
    const dataSource = list.length > 0 && Object.keys(list[0]).map((item, inx) => {
        list[0][item] = {
            ...list[0][item],
            key : inx,
            inx : inx + 1,
        }
        return list[0][item];
    });

    const currentPage = service.getValue(fetch, 'multipleList.rankList.page', 1);
    const makeSource = {count : 2, results : dataSource };
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

    getParamsFormLocation(){
        const { location } = this.props;
        return service.toSearchParams(location.search);
    }

    getColumns(columns){
        return columns.map(column => {
            return column;
        });
    }

    render() {
        const { ranks, match, currentPage, data } = this.props;
        const type = service.getValue(match, 'params.type', 'user');

        return (
            <div className="rank-wrapper user-rank-wrapper">
                {Object.keys(ranks).length > 0 &&  (<ListTop item={ranks} type={type} />)}
                <List data={data} columns={this.getColumns(rankColumns)} currentPage={currentPage}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(RankListContainer);
