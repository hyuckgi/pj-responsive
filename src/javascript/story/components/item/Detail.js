import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../../commons/configs';

import { Info, CommentList, Contents } from './';

const mapStateToProps = ({ fetch }) => {
    const item = service.getValue(fetch, 'item.data', {});

    return{
        item
    }
}

class Detail extends React.Component {

    render() {
        const { item } = this.props;

        return (
            <div className="detail-wrppper">
                <Contents item={item}/>
                <Info item={item}/>
                <CommentList item={item}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Detail);
