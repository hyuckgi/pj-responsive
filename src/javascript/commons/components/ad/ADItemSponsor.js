import React from 'react';
import { createForm } from 'rc-form';
import moment from 'moment';

import { Player, BigPlayButton } from 'video-react';
import UAParser from 'ua-parser-js';

import { APICaller } from '../../api';
import { api, service, values } from '../../configs';
import { CustomIcon } from '../../components';

import { Flex, Button, List, Modal } from 'antd-mobile';
import { Modal as WebModal } from 'antd';

import NoImg from '../../../../resource/commons/no_image_available.png';
import { Item } from './';

const parser = new UAParser();

class ADItemSponsor extends React.Component {

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
        this.onSubmitModify = this.onSubmitModify.bind(this);

        this.errorToast = this.errorToast.bind(this);
        this.makeModal = this.makeModal.bind(this);
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

    makeModal(messages){
        return WebModal.error({
            title : '오류가 발생했습니다.',
            content : (<div>
                {messages.map((message, idx) => {
                    return (<p key={idx}>{message}</p>)
                })}
            </div>),
        });
    }

    errorToast(errors = null){
        const { getFieldError } = this.props.form;
        if(!errors){
            return;
        }

        const messages = Object.keys(errors)
            .map(item => {
                return getFieldError(item);
            })
            .reduce((result, item, idx) => {
                return result.concat(item);
            }, []);

        return this.makeModal(messages);
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

    onSubmitModify(){
        const { form, item } = this.props;
        const adNo = service.getValue(item, 'adNo', false);

        if(!adNo){
            return;
        }

        form.validateFields((errors, value) => {
            console.log("errors", errors);
            console.log("value", value);

            if(!errors){
                const flag = service.getValue(value, 'adFile', false) ? true : false;

                let newParams;
                if(flag){
                    newParams = {adFileNo : service.getFileNo(service.getValue(value, 'adFile.fileList', [])).find(item => item)};
                }

                newParams = {
                    ...newParams,
                    title : value.title,
                    adNo,
                }

                const obj = api.postAD(newParams);

                return APICaller.put(obj.url, obj.params)
                    .then((...args) => {
                        console.log("args", args);
                    })
                    .catch((err) => {
                        return this.errorToast(err)
                    });

            }

            return this.errorToast(errors);
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
        const { form, item } = this.props;
        return this.onOpenModal({
            type: 'modify',
            title : '광고 수정',
            contents : (<Item form={form} item={item}/>)
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
        const name = service.getValue(item, 'name', '');
        const src = service.getValue(item, 'videoUrl');

        return this.onOpenModal({
            type : 'preview',
            title : `미리보기-${name}`,
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
                />
                <Button
                    style={{marginLeft : 5}}
                    icon={(<CustomIcon type="FaTrashO" roots="FontAwesome" />)}
                    type="warning"
                    size="small"
                    inline
                    onClick={this.onDelete}
                />
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

    render() {
        const { item } = this.props;
        const { visible } = this.state;
        const isMobile = parser.getDevice().type;
        const thumbnailUrl = service.getValue(item, 'thumbnailUrl', NoImg);
        const playTime = service.getValue(item, 'playTime', 0);
        const duration = moment.duration(playTime, 's');

        return (
            <List.Item
                thumb={thumbnailUrl}
                extra={this.renderExtra()}
            >
                <Flex direction="column" align="start" className="ad-item">
                    <Flex.Item className="title-area">
                        {service.getValue(item, 'name', '')}
                        <Button
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

export default createForm()(ADItemSponsor);
