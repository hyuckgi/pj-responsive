import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../../../redux/actions';
import { service, api } from '../../../commons/configs';

import { CommentList, Comment } from '../../../commons/components';

import { Info, Contents } from './';

const mapStateToProps = ({ fetch, security }) => {
    const item = service.getValue(fetch, 'item.data', {});
    const userInfo = security || {};
    const comments = service.getValue(fetch, 'multipleList.comments', false);

    return{
        item,
        userInfo,
        comments
    }
}

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Detail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page : 1,
            size : 10,
        }

        this.onEvents = this.onEvents.bind(this);
    }

    componentDidMount() {
        const storyNo = service.getValue(this.props, 'item.storyNo', false);

        if(storyNo){
            return this.getComments(storyNo)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const prevStoryNo = service.getValue(prevProps, 'item.storyNo', false);
        const currentStoryNo = service.getValue(this.props, 'item.storyNo', false);

        if(currentStoryNo && prevStoryNo !== currentStoryNo){
            return this.getComments(currentStoryNo);
        }
    }

    getComments(storyNo){
        const { page, size } = this.state;
        const obj = api.getComments(storyNo, page, size);

        return this.props.multipleList([{id : 'comments', url : obj.url, params : obj.params}]);
    }

    onEvents(params){
        const { events } = params;
        const storyNo = service.getValue(this.props, 'item.storyNo', false);

        switch (events) {
            case 'update':
                return this.getComments(storyNo)
                    .then(() => {
                        return window.location.reload();
                    });
            default:
                break;
        }
    }

    render() {
        const { item, userInfo, comments } = this.props;

        return (
            <div className="detail-wrppper">
                <Contents item={item}/>
                <Info item={item}/>
                <Comment item={item} userInfo={userInfo} onEvents={this.onEvents}/>
                <CommentList comments={comments}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Detail);
