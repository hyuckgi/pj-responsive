import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { ItemList, ListTop } from '../../../commons/components/item';

import { fetch } from '../../../redux/actions';
import { service, values, api, path } from '../../../commons/configs';


import { WhiteSpace } from 'antd-mobile';
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
            size : 10,
        }

        this.getList = this.getList.bind(this);
        this.onChangeParams = this.onChangeParams.bind(this);
        this.renderCategory = this.renderCategory.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.type !== this.props.match.params.type || prevProps.location.search !== this.props.location.search || prevState !== this.state){
            this.getList();
        }
    }

    renderCategory(){
        const { location } = this.props;
        const query = queryString.parse(location.search);
        const categoryNo = service.getValue(query, 'category', false);

        if(!categoryNo){
            return (<WhiteSpace size="md" />);
        }

        return(<Category category={categoryNo.split('/').slice(-1).find(item => item)} />)
    }

    onChangeParams(params){
        this.setState({
            ...this.state,
            ...params,
        });
    }

    getList(){
        const { match, location } = this.props;
        const { order, page, size } = this.state;
        const query = queryString.parse(location.search);
        const categoryNo = service.getValue(query, 'category', 0);
        const type = service.getValue(match, 'params.type', 'all');
        const current = service.getValue(values,  'story.status')
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
        const { order } = this.state;

        return (
            <div className='story-list-wrapper'>
                <WhiteSpace size="md" />
                {this.renderCategory()}
                <ListTop order={order} onChange={this.onChangeParams} prefixUrl={path.storyList}/>
                <ItemList count={4} data={stories} prefixUrl={path.storyItem} prefix="story"/>
            </div>

        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(StoryList);
