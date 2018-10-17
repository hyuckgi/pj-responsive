import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../../commons/configs';
import { Contents } from './';

const mapStateToProps = ({ fetch }) => {
    const reviewData = service.getValue(fetch, 'item.data.reviewData', {});

    return{
        reviewData
    }
}

class Review extends React.Component {

    render() {
        const { reviewData } = this.props;

        return (
            <div className="review-wrppper">
                <Contents item={reviewData}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Review);
