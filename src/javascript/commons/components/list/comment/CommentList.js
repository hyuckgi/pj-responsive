import React from 'react';
import { connect } from 'react-redux';
import { FormMode } from '../../../../commons/types';

import { fetch } from '../../../../redux/actions';
import { service, api } from '../../../../commons/configs';

import { Button } from 'antd';

import { Comment } from './';

const mapStateToProps = ({ fetch }) => {
    const isFetching = fetch.isFetching || false;
    const comments = service.getValue(fetch, 'multipleList.comments', false);

    return{
        isFetching,
        comments
    }
}

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class CommentList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            size : 10,
            loading : false,
        }

        this.renderComments = this.renderComments.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        const storyNo = service.getValue(this.props, 'item.storyNo', false);

        if(storyNo){
            return this.getComments(storyNo)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { status, item, onEvents, isFetching } = this.props;

        const prevStoryNo = service.getValue(prevProps, 'item.storyNo', false);
        const currentStoryNo = service.getValue(item, 'storyNo', false);

        if((currentStoryNo && prevStoryNo !== currentStoryNo)){
            return this.getComments(currentStoryNo);
        }

        if(status && status !== prevProps.status){
            onEvents({events : 'complete'});
            return this.getComments(currentStoryNo);
        }

        if(!isFetching && isFetching !== prevProps.isFetching){
            this.setState({
                loading : false,
            })
        }
    }

    getComments(storyNo){
        const { page, size } = this.state;
        const url = api.getComments(storyNo, page, size);

        return this.props.multipleList([{id : 'comments', url : url, params : {}}]);
    }

    renderComments(comments){
        const list = service.getValue(comments, 'list', []);
        return (
            <div className="comment-list">
                {list.map((item, inx) => {
                    return (<Comment key={inx} item={item} onEvents={this.props.onEvents} mode={FormMode.READ}/>)
                })}
            </div>
        )
    }

    onClick(){
        const storyNo = service.getValue(this.props, 'item.storyNo', false);

        return this.setState({
            loading : true,
            size : this.state.size + 10,
        }, () => {
            return this.getComments(storyNo);
        });
    }

    render() {
        const { comments } = this.props;
        const { loading } = this.state;
        const totalSize = service.getValue(comments, 'totalSize', 0);
        const page = service.getValue(comments, 'page', 1);
        const size = service.getValue(comments, 'size', 10);

        return (
            <div className="comments-wrapper">
                <div className="comments-top">
                    <p>댓글<span>{service.amount(totalSize)}개</span></p>
                </div>
                {comments && this.renderComments(comments)}
                <div className="btn-wrapper">
                    { totalSize > 10 && page * size < totalSize
                        ? <Button loading={loading} onClick={this.onClick} className="btn-more">댓글 더보기</Button>
                        : (<p>마지막 댓글입니다.</p>)
                    }
                </div>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(CommentList);
