import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

import { StoryList as List, StoryListTop } from '../../../commons/components';

import { fetch } from '../../../redux/actions';
import { service, values, api, path } from '../../../commons/configs';

import { Category } from './';

const mapStateToProps = ({fetch}) => {
    const stories = service.getValue(fetch, 'multipleList.stories', {});

    return {
        stories
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
        const categoryNo = service.getValue(query, 'category', 0);
        const type = service.getValue(match, 'params.type', 'all');
        const current = service.getValue(values,  'story.options')
            .filter(item => item.path === type)
            .find(item => item);

        const obj = api.getList(
            {status : current.status, order : order},
            page,
            size,
            parseInt(categoryNo, 10)
        );

        return this.props.multipleList([
            {id : 'stories', url : obj.url, params : obj.params }
        ]);
    }

    render() {
        const { stories } = this.props;
        const { size, order } = this.state;
        const isEnded = service.getValue(stories, 'size', 20) >= service.getValue(stories, 'totalSize', 20);

        return (
            <div className='story-list-wrapper'>
                {this.renderCategory()}
                <StoryListTop order={order} onChange={this.onChangeParams} prefixUrl={path.storyList}/>
                <List count={4} data={stories} prefixUrl={path.storyItem} prefix="story"/>
                <div className="story-list-bottom">
                    {isEnded ? (<p>마지막 리스트입니다.</p>) : (<p onClick={this.onClick}>More</p>)}
                </div>
            </div>

        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(StoryList);
