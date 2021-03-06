import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { StoryList as List, StoryListTop } from '../../../commons/components';

import { fetch } from '../../../redux/actions';
import { service, values, api, path } from '../../../commons/configs';

import { Category } from './';
import { Button } from 'antd';

const mapStateToProps = ({fetch}) => {
    const stories = service.getValue(fetch, 'multipleList.stories', {});
    const isFetching = fetch.isFetching || false;

    return {
        stories,
        isFetching
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class StoryList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            order : 0,
            page : 1,
            size : 20,
        }

        this.getList = this.getList.bind(this);
        this.onChangeParams = this.onChangeParams.bind(this);
        this.renderCategory = this.renderCategory.bind(this);

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.type !== this.props.match.params.type){
            return this.setState({
                page : 1,
                size : 20,
            }, () => {
                this.getList();
            });
        }
        if(prevProps.location.search !== this.props.location.search || prevState !== this.state){
            return this.getList();
        }
    }

    renderCategory(){
        const { location } = this.props;
        const query = queryString.parse(location.search);
        const categoryNo = service.getValue(query, 'category', false);

        if(!categoryNo){
            return null;
        }

        return(<Category category={categoryNo.split('/').slice(-1).find(item => item)} />)
    }

    onChangeParams(params){
        this.setState({
            ...this.state,
            ...params,
        });
    }

    onClick(){
        this.setState(prevState => ({
            ...prevState,
            page : 1,
            size : prevState.size += 20,
        }));
    }

    getList(){
        const { match, location } = this.props;
        const { order, page, size } = this.state;
        const query = queryString.parse(location.search);
        const categoryNo = service.getValue(query, 'category', false);
        const type = service.getValue(match, 'params.type', 'all');
        const current = service.getValue(values, 'story.options')
            .filter(item => item.path === type)
            .find(item => item);

        const categories = categoryNo ? categoryNo.split('/') : [];
        const cateNo = categories.length > 0 ? parseInt(categories[categories.length - 1], 10) : null;

        let params = {
            status : current.status,
            order,
        }

        if(service.getValue(query, 'hashtag', false)){
            params = {...params, hashtag : service.getValue(query, 'hashtag')}
        }

        const obj = api.getList(
            params,
            page,
            size,
            cateNo
        );

        return this.props.multipleList([
            {id : 'stories', url : obj.url, params : obj.params }
        ]);
    }

    render() {
        const { stories, isFetching } = this.props;
        const { order } = this.state;
        const isEnded = service.getValue(stories, 'size', 20) >= service.getValue(stories, 'totalSize', 20);

        return (
            <div className='story-list-wrapper'>
                {this.renderCategory()}
                <StoryListTop order={order} onChange={this.onChangeParams} prefixUrl={path.storyList}/>
                <List count={4} data={stories} prefixUrl={path.storyItem} prefix="story"/>
                <div className="story-list-bottom">
                    {isEnded ? (<p>마지막 리스트입니다.</p>) : (<Button loading={isFetching} onClick={this.onClick} className="btn-more">More</Button>)}
                </div>
            </div>

        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(StoryList);
