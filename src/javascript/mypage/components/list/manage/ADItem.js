import React from 'react';
import moment from 'moment';

import { Player, BigPlayButton } from 'video-react';
import UAParser from 'ua-parser-js';

import { APICaller } from '../../../../commons/api';
import { api, service, columns, path, values } from '../../../../commons/configs';
import { CustomIcon } from '../../../../commons/components';
import { FormMode } from '../../../../commons/types';

import { Flex, Button, List, Modal } from 'antd-mobile';

import NoImg from '../../../../../resource/commons/no_image_available.png';

const parser = new UAParser();

class ADItem extends React.Component {

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
        this.renderItem = this.renderItem.bind(this);
        this.renderExtra = this.renderExtra.bind(this);

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
        this.onModify = this.onModify.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onPress = this.onPress.bind(this);

        this.onSubmitDelete = this.onSubmitDelete.bind(this);
    }

    onPress(){
        const type = service.getValue(this.state, 'modalContent.type', false);
        console.log("type", type);

        this.onCloseModal();
        switch (type) {
            case 'delete':
                return this.onSubmitDelete();
            default:
                break;
        }
    }

    onSubmitDelete(){
        const { onEvents, item } = this.props;
        const adNo =  service.getValue(item, 'adNo', false);

        return APICaller.delete(api.deleteAD(adNo), {})
        .then(({data}) => {
            const resultCode = service.getValue(data, 'resultCode', false);
            if(resultCode === 200){
                onEvents({
                    events : 'update',
                });
            };
            return;
        });
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

    getModalContents(){
        const { modalContent } = this.state;
        return modalContent.contents;
    }

    getModalTitle(){
        const { modalContent } = this.state;
        return modalContent.title;
    }

    onModify(){
        return this.onOpenModal({
            type: 'modify',
            title : '광고 수정',
            contents : '선텍한 광고를 수정하시겠습니까?'
        });
    }

    onDelete(){
        return this.onOpenModal({
            type: 'delete',
            title : '광고 삭제',
            contents : '선텍한 광고를 삭제하시겠습니까?'
        });
    }

    onPreview(){
        const { item } = this.props;
        const title = service.getValue(item, 'title', '');
        const src = 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4';

        return this.onOpenModal({
            type : 'preview',
            title : `미리보기-${title}`,
            contents : (
                <Player
                    preload={'auto'}
                    playsInline={true}
                    autoPlay={true}
                >
                    <source src={src} />
                    <BigPlayButton position="center" />
                </Player>
            )
        });
    }

    renderExtra(){
        return(
            <div>
                <Button
                    icon={(<CustomIcon type="MdBuild" />)}
                    type="ghost"
                    size="small"
                    inline
                    onClick={this.onModify}
                >수정</Button>
                <Button
                    style={{marginLeft : 5}}
                    icon={(<CustomIcon type="FaTrashO" roots="FontAwesome" />)}
                    type="warning"
                    size="small"
                    inline
                    onClick={this.onDelete}
                >삭제</Button>
            </div>
        )
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
        const cln = 'ad-modal';

        if(isMobile){
            return `${cln} ${cln}-${madalType} ${cln}-mobile`;
        }

        return `${cln} ${cln}-${madalType}`;
    }

    renderItem(){
        const { mode, item } = this.props;
        const { visible, modalContent } = this.state;
        const isMobile = parser.getDevice().type;
        const thumbnailUrl = service.getValue(item, 'thumbnailUrl', false);
        const playTime = service.getValue(item, 'playTime', 0);
        const duration = moment.duration(playTime, 's');

        if(mode === FormMode.READ){
            return(
                <List.Item
                    thumb={NoImg}
                    extra={this.renderExtra()}
                >
                    <Flex direction="column" align="start" className="ad-item">
                        <Flex.Item>
                            {service.getValue(item, 'title', '')}
                            <Button
                                style={{marginLeft : 5, verticalAlign : 'middle'}}
                                icon={(<CustomIcon type="MdPlayCircleOutline" />)}
                                type="ghost"
                                size="small"
                                inline
                               onClick={this.onPreview}
                           >play</Button>
                        </Flex.Item>
                        <Flex.Item>
                            재생시간 : {`${moment(duration.hours(), 'HH').format('HH')}:${moment(duration.minutes(), 'mm').format('mm')}:${moment(duration.seconds(), 'ss').format('ss')} 초`}
                        </Flex.Item>
                        <Flex.Item>
                            등록일시 : {`${moment(item.createDate, values.format.FULL_DATETIME_FORMAT).format(values.format.FULL_DATETIME_FORMAT)}`}
                        </Flex.Item>
                        <Flex.Item>
                            수정일시 : {`${moment(item.updateDate, values.format.FULL_DATETIME_FORMAT).format(values.format.FULL_DATETIME_FORMAT)}`}
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

    render() {
        return this.renderItem();
    }

}

export default ADItem;
