import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { CommentList } from '../../../commons/components';

import { fetch } from '../../../redux/actions';
import { api, service } from '../../../commons/configs';

const mapStateToProps = ({fetch}) => {
    const myComments = service.getValue(fetch, 'multipleList.myComments', false);

    return {
        myComments
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});


class MyCommentList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page : 1,
            size : 10,
        };

        this.getList = this.getList.bind(this);
    }

    componentDidMount() {
        this.getList()
    }

    getList(){
        const obj = api.getMyComments({...this.state});

        return this.props.multipleList([
            {id : 'myComments', url : obj.url, params : obj.params}
        ]);
    }

    componentDidUpdate(prevProps, prevState) {
        const prevId = service.getValue(prevProps, 'match.params.id', false);
        const currentId = service.getValue(this.props, 'match.params.id', false);
        if(prevId !== currentId){
            return this.getList(currentId);
        }
    }

    render() {
        const { myComments } = this.props;

        return (
            <CommentList comments={myComments}/>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MyCommentList));
