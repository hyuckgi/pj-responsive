import React from 'react';
import { connect } from 'react-redux';

import { fetch } from '../../../redux/actions';
import { service } from '../../../commons/configs';

import { CommentList, Comment, DonationList } from '../../../commons/components';
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

    renderDonation(item){
        const list = service.getValue(item, 'adList', []);

        return(
            <div className="donation-wrppper">
                <div className="donation-wrppper-inner">
                    <div className="donation-wrppper-area">
                        <p>{`스폰서 광고 ${list.length}개`}</p>
                        {list.length === 0 ? (<p className="list-none">스폰서 광고 목록이 없습니다.</p>) : (<DonationList  />)}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { item } = this.props;
        const { status } = this.state;

        return (
            <div className="detail-wrppper">
                <Contents item={item}/>
                <Info item={item}/>

                {Object.keys(item).length && this.renderDonation(item)}

                <Comment item={item} onEvents={this.onEvents} mode={FormMode.WRITE}/>
                <CommentList item={item} onEvents={this.onEvents} status={status}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Detail);
