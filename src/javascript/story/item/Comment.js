import React from 'react';

class Comment extends React.Component {

    render() {
        const { item } = this.props;
        console.log("item", item);
        return (
            <div>Comment</div>
        );
    }

}

export default Comment;
