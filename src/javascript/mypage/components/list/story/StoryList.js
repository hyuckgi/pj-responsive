import React from 'react';
import { connect } from 'react-redux';

import { service, values, api, path } from '../../../../commons/configs';
import { fetch } from '../../../../redux/actions';

const mapStateToProps = ({ fetch }) => {
    const profile = service.getValue(fetch, 'item.data', false);

    return{
        profile
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class StoryList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page : 1, 
            size : 10,
        }

        this.getStory = this.getStory.bind(this);
    }

    componentDidMount() {
        this.getStory()
    }

    getStory(){

    }

    render() {
        return (
            <div>StoryList</div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(StoryList);
