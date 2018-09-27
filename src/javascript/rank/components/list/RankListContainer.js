import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { fetch } from '../../../redux/actions';

import { api, service, columns, path } from '../../../commons/configs';
import { TableList} from '../../../commons/components';

import { ListTop } from '../common';

import { Avatar, Select } from 'antd';
import { Flex } from 'antd-mobile';

const Option = Select.Option;

const selectOptions = [
    { value : 'all', label : '전체'},
    { value : 'year', label : '연도별'},
]

const mapStateToProps = ({fetch}) => {
    const ranks = service.getValue(fetch, 'multipleList.rankTop.data', {});
    const resultObj = service.getValue(fetch, 'multipleList.rankList', {});
    const list = service.getValue(resultObj, 'list', []);
    const dataSource = list.map((item, inx) => {
        item = {
            ...item,
            key : inx,
            inx : inx + 1,
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
        data,
        ranks,
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
            size : 10,
            page : 1,
            selectValue : 'all',
        };

        this.getData = this.getData.bind(this);
        this.getColumns = this.getColumns.bind(this);
        this.onEvents = this.onEvents.bind(this);

        this.onSelect = this.onSelect.bind(this);
        this.renderSelect = this.renderSelect.bind(this);

        this.search = this.search.bind(this);
    }

    search(params) {
        const type = service.getValue(this.props, 'match.params.type', false);

        if(type){
            this.props.move(path.fullList(`${path.rankList}/${type}`, {...params}));
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


    componentDidMount() {
        this.getData(this.getParamsFormLocation());
    }

    componentDidUpdate(prevProps, prevState) {
        const { location } = this.props;
        if(prevProps.location.search !== location.search){
            this.setState({
                selectValue : 'all'
            })
            this.getData(this.getParamsFormLocation());
        }
    }

    getData(searchParams){
        const { selectValue } = this.state;
        const type = service.getValue(this.props, 'match.params.type', 'user');
        const flag = type === 'user' ? 'donate' : 'sponsor';

        return this.props.multipleList([
            {id : 'rankTop', url : api.getRank(flag), params : {}},
            {id : 'rankList', url : api.getRankList({type : flag, ...searchParams, term : selectValue}), params : {}},
        ])
    }

    getParamsFormLocation(){
        const { location } = this.props;
        return service.toSearchParams(location.search);
    }

    getColumns(){
        const type = service.getValue(this.props, 'match.params.type', 'user');
        const key = `${type}RankList`;

        return columns[key].map(column => {
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
            selectValue : value
        }, () => {
            return this.getData(this.getParamsFormLocation());
        });
    }

    renderSelect(){
        const { selectValue } = this.state;

        return (
            <Select
                ref='select'
                value={selectValue}
                onSelect={this.onSelect}
                style={{ minWidth: 150 }}
            >
                {selectOptions.map((item, inx) => {
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
        const { ranks, match, data } = this.props;
        const type = service.getValue(match, 'params.type', 'user');
        const title = type === 'user' ? '기부 랭킹' : '스폰서 랭킹';

        return (
            <div className={`rank-wrapper ${type}-rank-wrapper`}>
                {Object.keys(ranks).length > 0 &&  (<ListTop item={ranks} type={type} />)}
                <div className="rank-list">
                    <Flex justify="between" className="rank-list-top">
                        <Flex.Item >
                            <h3>{title} {data.total > 0 && `(${data.total} 건)`}</h3>
                        </Flex.Item>
                        <Flex.Item style={{textAlign : 'right'}}>
                            {this.renderSelect()}
                        </Flex.Item>
                    </Flex>
                    <TableList
                        data={data}
                        columns={this.getColumns()}
                        onEvents={this.onEvents}
                    />
                </div>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(RankListContainer);
