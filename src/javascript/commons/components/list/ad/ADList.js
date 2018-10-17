import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { APICaller } from '../../../api';
import { fetch } from '../../../../redux/actions';
import { api, service, constants } from '../../../configs';

import { Button, List, Modal } from 'antd-mobile';
import { Modal as WebModal } from 'antd';

import { ListItem, Item } from './';

const mapStateToProps = ({fetch}) => {
    const list = service.getValue(fetch, 'multipleList.ADList.list', []);

    return {
        list,
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
    move: (location) => dispatch(push(location)),
});

class ADList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page : 1,
            size : 10,
            visible : false,
            modalContent : {
                type : null,
                title : '',
                contents : '',
            },
            status : '',
        }

        this.getList = this.getList.bind(this);
        this.renderList = this.renderList.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderButton = this.renderButton.bind(this);

        this.onEvents = this.onEvents.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onOk = this.onOk.bind(this);

        // modal
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onPress = this.onPress.bind(this);
        this.getModalTitle = this.getModalTitle.bind(this);
        this.getModalContents = this.getModalContents.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.getClassName = this.getClassName.bind(this);

        // error
        this.errorToast = this.errorToast.bind(this);
        this.makeModal = this.makeModal.bind(this);
    }

    componentDidMount() {
        this.getList();
    }

    getList(){
        const { page, size } = this.state;
        return this.props.multipleList([{id : 'ADList', url : api.getADList({page, size}), params : {}}])
    }

    onEvents(params){
        const { events } = params;

        switch (events) {
            case 'update':
                return this.getList();
            case 'close' :
                return this.onCloseModal();
            default:
                break;
        }
    }

    onCreate(e){
        e && e.preventDefault();
        const { form } = this.props;

        return this.onOpenModal({
            type: 'create',
            title : '광고 등록',
            contents : (<Item form={form} onEvents={this.onEvents} />)
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

    getClassName(){
        const isMobile = service.isMobile();
        const madalType = service.getValue(this.state, 'modalContent.type', false);
        const classname = 'ad-modal';

        if(isMobile){
            return `${classname} ${classname}-${madalType} ${classname}-mobile`;
        }

        return `${classname} ${classname}-${madalType}`;
    }

    getModalContents(){
        const { modalContent } = this.state;
        return modalContent.contents;
    }

    getModalTitle(){
        const { modalContent } = this.state;
        return modalContent.title;
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

    onOk(){
        this.onCloseModal();
        this.onEvents({events : 'update'});
    }

    onSubmit(){
        const { form } = this.props;

        form.validateFields((errors, value) => {

            if(!errors){
                const adImageFileNo = service.getFileNo(service.getValue(value, 'adImageFile.fileList', [])).find(item => item);
                const adFileNo = service.getFileNo(service.getValue(value, 'adFile.fileList', [])).find(item => item);
                const obj = api.postAD({title : value.title, adFileNo, adImageFileNo});

                return APICaller.post(obj.url, obj.params)
                    .then(({data}) => {
                        const resultCode = service.getValue(data, 'resultCode', false);
                        const resultMsg = service.getValue(data, 'resultMsg', '')
                        if(resultCode && resultCode === 200){
                            return WebModal.success({
                                title : '광고 등록 성공',
                                content : '광고가 등록되었습니다.',
                                onOk : this.onOk,
                            });
                        }
                        return this.makeModal([resultMsg]);
                    })
                    .catch((err) => {
                        return this.errorToast(err)
                    });
            }

            return this.errorToast(errors);
        });
    }

    onPress(){
        const type = service.getValue(this.state, 'modalContent.type', false);

        switch (type) {
            case 'create':
                return this.onSubmit();
            default:
                break;
        }
    }

    onOpenModal(modalContent){
        this.setState({
            visible : true,
            modalContent
        });
    }

    resetFields(){
        const { form } = this.props;

        form.resetFields();
    }

    onCloseModal(){
        this.setState({
            visible : false,
        }, () => {
            this.resetFields();
        });
    }

    renderList(){
        const { list, path } = this.props;

        if(!list.length){
            return(
                <List.Item wrap className="list-none">
                    <p>등록된 광고가 없습니다.</p>
                    <p>광고를 등록해 주세요.</p>
                    <p className="last">광고는 최대 10개까지만 등록하여 사용하실 수 있습니다.</p>
                </List.Item>
            )
        }

        return list.map((item, idx) => {
            return(<ListItem key={idx} item={item} onEvents={this.onEvents} path={path}/>)
        })
    }

    onClick(e){
        e && e.preventDefault();
        this.props.move('/mypage/list/manage');
    }

    renderButton(){
        const { path, list } = this.props;

        if(list.length >= constants.AD_MAX_SIZE){
            return;
        }

        if(path === 'story'){
            return (<Button inline type="primary" onClick={this.onClick}>새로운 광고 등록</Button>)
        }

        return (<Button inline type="primary" onClick={this.onCreate}>광고등록</Button>)
    }

    renderHeader(){
        const { list } = this.props;

        return(
            <List.Item
                extra={this.renderButton()}
                align="middle"
            >
                등록된 광고 : {`${service.getValue(list, 'length', 0)} / 10`}
            </List.Item>
        )
    }

    render() {
        const { visible } = this.state;
        const isMobile = service.isMobile();

        return (
            <div className="list-wrap ad-wrap">
                <List
                    className="ad-list"
                    renderHeader={this.renderHeader()}
                >
                    {this.renderList()}
                </List>

                <Modal
                    visible={visible}
                    transparent={isMobile ? false : true}
                    popup={isMobile ? true : false}
                    animationType={isMobile ? 'slide-up' : 'fade'}
                    maskClosable={false}
                    closable={false}
                    wrapClassName={this.getClassName()}
                    title={this.getModalTitle()}
                    onClose={this.onCloseModal}
                    footer={this.getFooter()}
                >
                    {this.getModalContents()}
                </Modal>
            </div>
        );
    }
}

export default createForm()(connect(mapStateToProps, mapDispatchProps)(ADList));
