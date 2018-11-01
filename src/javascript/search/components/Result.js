import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { service, api, path } from '../../commons/configs';
import { StoryList as List } from '../../commons/components';
import { fetch } from '../../redux/actions';

import { Button } from 'antd';

const mapStateToProps = ({code, fetch}) => {
    const stories = service.getValue(fetch, 'item', {});
    const isFetching = fetch.isFetching || false;

    return {
        stories,
        isFetching
    }
};

const mapDispatchProps = dispatch => ({
    getItem : (url, params) => dispatch(fetch.get(url, params)),
    reset : () => dispatch(fetch.reset())
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
    }

    componentDidMount() {
        this.getList();
    }

    componentWillUnmount() {
        this.props.reset();
    }

    getList(){
        const { location } = this.props;
        const { page, size } = this.state;
        const query = queryString.parse(location.search);
        const keyword = service.getValue(query, 'keyword', false);

        if(!keyword){
            return;
        }
        const obj = api.getList({keyword : keyword}, page, size);
        return this.props.getItem(obj.url, obj.params);
    }

    onClick(){
        this.setState(prevState => ({
            ...prevState,
            page : 1,
            size : prevState.size += 20,
        }));
    }

    render() {
        const { stories, isFetching } = this.props;
        console.log("stories", stories);
        const isEnded = service.getValue(stories, 'size', 20) >= service.getValue(stories, 'totalSize', 20);

        return (
            <div className="story-list-wrapper search-result">
                <List count={4} data={stories} prefixUrl={path.storyItem} prefix="story"/>
                <div className="story-list-bottom">
                    {isEnded ? (<p>마지막 리스트입니다.</p>) : (<Button loading={isFetching} onClick={this.onClick} className="btn-more">More</Button>)}
                </div>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Result);
