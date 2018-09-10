import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../../commons/configs';

// import { Info, Comment, Contents } from './';

import { Contents } from './';

const mapStateToProps = ({ fetch }) => {
    const item = service.getValue(fetch, 'item.data', {});

    return{
        item
    }
}

class Review extends React.Component {

    render() {
        const { item } = this.props;

        return (
            <div className="review-wrppper">
                <Contents item={item}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Review);
