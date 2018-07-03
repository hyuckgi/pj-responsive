import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../../../redux/actions';

import { api, service } from '../../../commons/configs';

import { ItemTop } from '../common';

const mapStateToProps = ({fetch}) => {
    const ranks = service.getValue(fetch, 'multipleList.userRanks.data', {});

    return {
        ranks
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class User extends React.Component {

    render() {
        return (
            <div>User</div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(User);
