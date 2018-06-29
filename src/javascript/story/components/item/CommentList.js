import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetch } from '../../../redux/actions';
import { service, values, api, path } from '../../../commons/configs';

import { Comment } from './';

const mapStateToProps = ({fetch}) => {
    const comments = service.getValue(fetch, 'multipleList.comments', false);

    return {
        comments
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class CommentList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page : 1,
            size : 10,
        }

        this.renderComments = this.renderComments.bind(this);
        this.getComments = this.getComments.bind(this);
        this.renderComments = this.renderComments.bind(this);
    }

    renderComments(comments){
        const list = service.getValue(comments, 'list', []);

        return (
            <div className="comments-list">
                {list.map((item, inx) => {
                    return (<div>ddd</div>)
                })}
            </div>
        )
    }

    componentDidMount() {
        const storyNo = service.getValue(this.props, 'match.params.id', false);

        if(storyNo){
            this.getComments(storyNo)
        }
    }

    getComments(storyNo){
        const { page, size } = this.state;
        const obj = api.getComments(storyNo, page, size);

        return this.props.multipleList([{id : 'comments', url : obj.url, params : obj.params}]);
    }

    renderComments(comments){
        const list = service.getValue(comments, 'list', []);
        return (
            <div className="comment-list">
                {list.map((item, inx) => {
                    return (<Comment key={inx} item={item} />)
                })}
            </div>
        )
    }

    render() {
        const { comments } = this.props;
        return (
            <div className="comments-wrapper">
                <div className="comments-top">
                    <p>댓글  <span>{service.amount(service.getValue(comments, 'totalSize', 0))}개</span></p>
                </div>
                {comments && this.renderComments(comments)}
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CommentList));
