import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../../../redux/actions';
import { service, api } from '../../../commons/configs';

import { CommentList, Comment } from '../../../commons/components';
import { FormMode } from '../../../commons/types';

import { Info, Contents } from './';

const mapStateToProps = ({ fetch }) => {
    const item = service.getValue(fetch, 'item.data', {});

    return{
        item,
    }
}

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Detail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status : false,
        };

        this.onEvents = this.onEvents.bind(this);
    }

    onEvents(params){
        const { events } = params;
        const storyNo = service.getValue(this.props, 'item.storyNo', false);

        switch (events) {
            case 'update':
                this.setState({
                    status : true,
                });
                break;
            case 'complete' :
                this.setState({
                    status : false,
                });
                break;
            default:
                break;
        }
    }

    render() {
        const { item } = this.props;
        const { status } = this.state;

        return (
            <div className="detail-wrppper">
                <Contents item={item}/>
                <Info item={item}/>
                <Comment item={item} onEvents={this.onEvents} mode={FormMode.WRITE}/>
                <CommentList item={item} onEvents={this.onEvents} status={status}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Detail);
