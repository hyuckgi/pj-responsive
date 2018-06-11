import React from 'react';
import { connect } from 'react-redux';

import { ItemList } from '../../commons/components/item';

import { service } from '../../commons/configs';

// const mapStateToProps = ({fetch}) => {
//     return {
//
//     }
// };

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class StoryList extends React.Component {

    render() {
        const { type } = service.getValue(this.props, 'match.params');

        return (
            <ItemList count={4} path={type} />
        );
    }

}

export default connect(null, mapDispatchProps)(StoryList);
