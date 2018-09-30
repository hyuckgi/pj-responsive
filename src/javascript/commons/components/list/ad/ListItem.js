import React from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import moment from 'moment';

import { Player, BigPlayButton } from 'video-react';
import UAParser from 'ua-parser-js';

import { APICaller } from '../../../api';
import { api, service, values } from '../../../configs';
import { FormButton } from '../../../types';
import { CustomIcon, ButtonWrapper } from '../../../components';

import { Flex, Button, List, Modal } from 'antd-mobile';
import { Modal as WebModal } from 'antd';

import NoImg from '../../../../../resource/commons/no_image_available.png';
import { Item, Link } from './';

const parser = new UAParser();

const mapStateToProps = ({fetch}) => {
    const story = service.getValue(fetch, 'item', {});

    return {
        story,
    }
};

class ListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            modalContent : {
                type : null,
                title : '',
                contents : '',
            },
            accordion : false,
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
        this.onModify = this.onModify.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onPress = this.onPress.bind(this);

        this.onSubmitDelete = this.onSubmitDelete.bind(this);
        this.onSubmitModify = this.onSubmitModify.bind(this);
        this.onSubmitLink = this.onSubmitLink.bind(this);

        this.errorToast = this.errorToast.bind(this);
        this.makeModal = this.makeModal.bind(this);

        this.onLink = this.onLink.bind(this);

        this.onEvents = this.onEvents.bind(this);
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

    onSubmitLink(){
        const { form, item, story } = this.props;
        const adNo = service.getValue(item, 'adNo', false);
        const storyNo = service.getValue(story, 'data.storyNo', false);

        if(!storyNo || !adNo){
            return this.makeModal(['오류가 발생했습니다']);
        }

        form.validateFields((errors, value) => {
            console.log('errors', errors);
            console.log('value', value);

            if(!value.isSponsorAgreement){
                return this.makeModal(['스폰서 약관 및 정책에 동의해주세요.'])
            }

            if(!errors){
                const newParams = {
                    ...value,
                    storyNo,
                    adNo
                };
                const obj = api.linkAD(newParams);

                return APICaller.post(obj.url, obj.params)
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

    onEvents(params){
        const { events } = params;

        switch (events) {
            case 'close' :
                this.onCloseModal();
            default:
                break;
        }
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
            contents : (<Item form={form} item={item} onEvents={this.onEvents}/>)
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

    onLink(){
        const { accordion } = this.state;
        this.setState({
            accordion : !accordion,
        })
    }

    onClickButton(id){
        console.log("id", id);
        switch (id) {
            case FormButton.UPDATE:
                return this.onModify();
            case FormButton.DELETE:
                return this.onDelete();
            case FormButton.SAVE :
                return this.onLink();
            case FormButton.CANCEL :
                return this.onLink();
            case FormButton.CONFIRM :
                return this.onSubmitLink()
            default:
                break;
        }

    }

    getButtons(){
        const { path, item } = this.props;
        const { accordion } = this.state;
        let buttons = [];

        if(accordion){
            return [
                {id : FormButton.CONFIRM, label : '연동요청', inline : false, style : {maxWidth : 100}},
                {id : FormButton.CANCEL, label : 'cancel', inline : false, type : 'ghost', style : {marginTop : 20, maxWidth : 100}},
            ]
        };

        if(path === 'story'){
            const isLinked = service.getValue(item, 'isAdLink', false);
            if(!isLinked){
                buttons.push({id : FormButton.SAVE, label : null, icon : (<CustomIcon type="FaChain" roots="FontAwesome" />)});
            }else{
                buttons.push({id : FormButton.CANCEL, label : '연동중', icon : (<CustomIcon type="FaChainBroken" roots="FontAwesome" />), disabled : true, type : 'warning'})
            }
        }else{
            buttons.push({ id : FormButton.UPDATE, label : null, icon : (<CustomIcon type="MdBuild" />), type : 'ghost', size : 'small', inline : true});
            buttons.push({ id : FormButton.DELETE, label : null, icon : (<CustomIcon type="FaTrashO" roots="FontAwesome" />), type : 'warning', size : 'small', inline : true, style : {marginLeft : 5}});
        };
        return buttons;
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
        const { item, form } = this.props;
        const { visible, accordion } = this.state;
        const isMobile = parser.getDevice().type;
        const thumbnailUrl = service.getValue(item, 'thumbnailUrl', NoImg);
        const playTime = service.getValue(item, 'playTime', 0);
        const duration = moment.duration(playTime, 's');

        return (
            <List.Item
                thumb={thumbnailUrl}
                extra={(<ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>)}
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

                {accordion && (<Link form={form} />)}

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

export default createForm()(connect(mapStateToProps)(ListItem));
