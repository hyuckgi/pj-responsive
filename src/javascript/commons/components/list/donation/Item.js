import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import UAParser from 'ua-parser-js';

import { APICaller } from '../../../api';
import { api, service } from '../../../configs';
import { FormButton } from '../../../types';
import { CustomIcon, ButtonWrapper } from '../../../components';

import { Flex, Button, List, Modal } from 'antd-mobile';
import { Modal as WebModal } from 'antd';

import NoImg from '../../../../../resource/commons/no_image_available.png';

import { Video } from './';

const parser = new UAParser();

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
            modalContent : {
                type : null,
                title : '',
                contents : '',
            },
        }

        this.getButtons = this.getButtons.bind(this);
        // modal
        this.getModalTitle = this.getModalTitle.bind(this);
        this.getModalContents = this.getModalContents.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.getClosable = this.getClosable.bind(this);
        this.getClassName = this.getClassName.bind(this);

        //func
        this.onPreview = this.onPreview.bind(this);
        this.onPress = this.onPress.bind(this);

        this.onEvents = this.onEvents.bind(this);

        //video
        this.onStart = this.onStart.bind(this);
        this.onEnded = this.onEnded.bind(this);
    }

    onPress(){
        const type = service.getValue(this.state, 'modalContent.type', false);

        this.onCloseModal();
        switch (type) {
            case 'delete':
                return this.onSubmitDelete();
            case 'modify':
                return this.onSubmitModify();
            default:
                break;
        }
    }

    getFooter(){
        const madalType = service.getValue(this.state, 'modalContent.type', false);
        const footers = [
            {text : 'Cancel', onPress : () => this.onCloseModal()},
            {text : 'OK', onPress : () => this.onPress()}
        ];

        switch (madalType) {
            case 'preview':
                return [];
            default:
                return footers;
        }
    }

    onCloseModal(){
        this.setState({
            visible : false,
        });
    }

    onOpenModal(modalContent){
        this.setState({
            visible : true,
            modalContent,
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

        console.log("onStart");
        console.log("adNo", adNo);
        console.log("storyNo", storyNo);
    }

    onEnded(){
        const { story } = this.props;
        const storyNo = service.getValue(story, 'storyNo', false);

        console.log("onEnded");
        console.log("storyNo", storyNo);
    }

    getModalContents(){
        const { modalContent } = this.state;
        return modalContent.contents;
    }

    getModalTitle(){
        const { modalContent } = this.state;
        return modalContent.title;
    }

    onPreview(){
        const { item } = this.props;
        const name = service.getValue(item, 'name', '');
        const src = service.getValue(item, 'videoUrl');

        return this.onOpenModal({
            type : 'preview',
            title : `기부하기-${name}`,
            contents : (<Video src={src} onEvents={this.onEvents}/>)
        });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.CONFIRM :
                return this.onPreview();
            default:
                break;
        }
    }

    getButtons(){
        return [{ id : FormButton.CONFIRM, label : '기부하기', icon : (<CustomIcon type="FaHeartbeat" roots="FontAwesome"/>), size : 'small', inline : true}];
    }

    getClosable(){
        const { modalContent } = this.state;
        const madalType = service.getValue(modalContent, 'type', false);

        switch (madalType) {
            case 'preview':
                return true;
            default:
                return false;
        }
    }

    getClassName(){
        const isMobile = parser.getDevice().type;
        const madalType = service.getValue(this.state, 'modalContent.type', false);
        const classname = 'ad-modal';

        if(isMobile){
            return `${classname} ${classname}-${madalType} ${classname}-mobile`;
        }

        return `${classname} ${classname}-${madalType}`;
    }

    render() {
        const { item } = this.props;
        const { visible } = this.state;
        const isMobile = parser.getDevice().type;
        const playTime = service.getValue(item, 'playTime', 0);
        const duration = moment.duration(playTime, 's');

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
                    visible={visible}
                    transparent={isMobile ? false : true}
                    popup={isMobile ? true : false}
                    animationType={isMobile ? 'slide-up' : 'fade'}
                    maskClosable={false}
                    closable={this.getClosable()}
                    wrapClassName={this.getClassName()}
                    title={this.getModalTitle()}
                    onClose={this.onCloseModal}
                    footer={this.getFooter()}
                >
                    {this.getModalContents()}
                </Modal>
            </List.Item>
        )
    }

}

export default connect(mapStateToProps)(Item);
