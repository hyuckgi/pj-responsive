import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { push } from 'react-router-redux';

import { service, api, path } from '../../commons/configs';
import { StoryList as List } from '../../commons/components';
import { fetch } from '../../redux/actions';

import { Button } from 'antd';
import { SearchBox, HashTag } from './';

const mapStateToProps = ({code, fetch}) => {
    const keyObj = service.getValue(fetch, 'multipleList.keyObj', {});
    const hashs = service.getValue(fetch, 'multipleList.hashs.list', []);
    const isFetching = fetch.isFetching || false;

    return {
        keyObj,
        hashs,
        isFetching
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
    resetMultipleList : () => dispatch(fetch.resetMultipleList()),
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Result extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            size : 20,
        };

        this.onClick = this.onClick.bind(this);
        this.getList = this.getList.bind(this);
        this.onEvents = this.onEvents.bind(this);
    }

    componentDidMount() {
        return this.getList();
    }

    componentDidUpdate(prevProps, prevState) {
        if(service.getValue(prevProps, 'location.search', '') !== service.getValue(this.props, 'location.search')){
            return this.getList();
        }
    }

    onEvents(params){
        const { events } = params;

        switch (events) {
            case 'search':
                return this.props.move(`${path.result}?keyword=${params.payload.keyword}`)
            case 'hash':
                return this.props.move(path.moveParams(path.storyList, 'all', params.payload));
            default:
                break;
        }
    }

    getList(){
        const { location } = this.props;
        const { page, size } = this.state;
        const query = queryString.parse(location.search);
        const keyword = service.getValue(query, 'keyword', false);

        if(!keyword){
            return;
        }
        const key = api.getList({keyword : keyword, status : 0}, page, size);
        const hash = api.getHash(1, 100, {keyword : keyword});
        return this.props.multipleList([
            {id : 'keyObj', url : key.url, params : key.params},
            {id : 'hashs', url : hash.url, params : hash.params}
        ]);
    }

    componentWillUnmount() {
        this.props.resetMultipleList();
    }

    onClick(){
        this.setState(prevState => ({
            ...prevState,
            page : 1,
            size : prevState.size += 20,
        }), () => {
            this.getList();
        });
    }

    render() {
        const { isFetching, keyObj, hashs } = this.props;
        const isEnded = service.getValue(keyObj, 'size', 20) >= service.getValue(keyObj, 'totalSize', 20);

        return (
            <div className="search-container">
                <SearchBox onEvents={this.onEvents} />

                <HashTag title={`태그검색 결과 : ${service.getValue(hashs, 'length', 0)}`} tags={hashs} onEvents={this.onEvents}/>

                <div className="story-list-wrapper">
                    <p className="title">{`스토리 검색 결과 : ${service.getValue(keyObj, 'totalSize', 0)}`} </p>
                    <List count={4} data={keyObj} prefixUrl={path.storyItem} prefix="story"/>
                    <div className="story-list-bottom">
                        {isEnded ? (<p>마지막 리스트입니다.</p>) : (<Button loading={isFetching} onClick={this.onClick} className="btn-more">More</Button>)}
                    </div>
                </div>


            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Result);
