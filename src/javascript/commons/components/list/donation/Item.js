import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { APICaller } from '../../../api';
import { api, service } from '../../../configs';
import { FormButton } from '../../../types';
import { CustomIcon, ButtonWrapper, VideoPlayer } from '../../../components';

import { Flex, List, Modal } from 'antd-mobile';
import { Modal as WebModal } from 'antd';

import NoImg from '../../../../../resource/commons/no_image_available.png';

const mapStateToProps = ({fetch}) => {
    const story = service.getValue(fetch, 'item.data', {});

    return {
        story,
    }
};

class Item extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : false,
        }

        this.getButtons = this.getButtons.bind(this);
        this.onClickButton = this.onClickButton.bind(this);

        // modal
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        //func
        this.onEvents = this.onEvents.bind(this);

        //video
        this.onStart = this.onStart.bind(this);
        this.onEnded = this.onEnded.bind(this);
    }

    onCloseModal(){
        this.setState({
            visible : false,
        });
    }

    onOpenModal(){
        this.setState({
            visible : true,
        });
    }

    onEvents(params){

        console.log("params", params);
        const { events } = params;

        switch (events) {
            case 'start' :
                return this.onStart();
            case 'close' :
                return this.onCloseModal();
            case 'ended' :
                return this.onEnded();
            default:
                break;
        }
    }

    onStart(){
        const { item, story } = this.props;
        const adNo = service.getValue(item, 'adNo', false);
        const storyNo = service.getValue(story, 'storyNo', false);

        const obj = api.donateAD({adNo, storyNo});

        return APICaller.post(obj.url, obj.params)
            .then((...args) => {
                console.log("res", args);
            });
    }

    onEnded(){
        const { story, item } = this.props;
        const { visible } = this.state;
        const storyNo = service.getValue(story, 'storyNo', false);

        const obj = api.donateAD({donateNo : storyNo});

        return APICaller.post(obj.url, obj.params)
            .then(({data}) => {
                console.log("res", data);

                if(data && visible){
                    WebModal.success({
                        title : '기부 성공',
                        content : `${service.getValue(item, 'donationPerTime', 0)}원을 기부했습니다.`,
                        onOk : this.onCloseModal
                    });
                }

            });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.CONFIRM :
                return this.onOpenModal();
            default:
                break;
        }
    }

    getButtons(){
        return [{ id : FormButton.CONFIRM, label : '기부하기', icon : (<CustomIcon type="FaHeartbeat" roots="FontAwesome"/>), size : 'small', inline : true}];
    }

    render() {
        const { item } = this.props;
        const { visible } = this.state;
        const playTime = service.getValue(item, 'playTime', 0);
        const duration = moment.duration(playTime, 's');
        const url = service.getValue(item, 'videoUrl');

        return (
            <List.Item
                thumb={service.getValue(item, 'imageUrl', NoImg)}
                extra={(<ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>)}
            >
                <Flex direction="column" justify="between" className="donation-item">
                    <Flex.Item className="title-area">
                        {service.getValue(item, 'name', '')}
                    </Flex.Item>
                    <Flex.Item>
                        기부금액 : {service.amount(service.getValue(item, 'donationPerTime', 0))} 원
                    </Flex.Item>
                    <Flex.Item>
                        재생시간 : {`${moment(duration.hours(), 'HH').format('HH')}:${moment(duration.minutes(), 'mm').format('mm')}:${moment(duration.seconds(), 'ss').format('ss')} 초`}
                    </Flex.Item>
                </Flex>

                <Modal
                    ref="modal"
                    visible={visible}
                    transparent={false}
                    maskClosable={false}
                    closable={true}
                    wrapClassName={'fullscreen-modal'}
                    title={''}
                    onClose={this.onCloseModal}
                >
                    <VideoPlayer url={url} onEvents={this.onEvents} controls={false} fullscreen={true} />
                </Modal>
            </List.Item>
        )
    }

}

export default connect(mapStateToProps)(Item);
