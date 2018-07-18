import React from 'react';

import { service } from '../../../commons/configs';

import { Comment } from './';

class CommentList extends React.Component {

    constructor(props) {
        super(props);

        this.renderComments = this.renderComments.bind(this);
    }

    renderComments(comments){
        const list = service.getValue(comments, 'list', []);
        return (
            <div className="comment-list">
                {list.map((item, inx) => {
                    return (<Comment key={inx} item={item} onEvents={this.onEvents}/>)
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

export default CommentList;
