import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import UAParser from 'ua-parser-js';

import { APICaller } from '../../../../commons/api';

import { Avatar } from 'antd';
import { Flex, Modal, Badge } from 'antd-mobile';

import { service, api, values, path } from '../../../../commons/configs';
import { FormButton, FormMode } from '../../../../commons/types';
import { CustomIcon, CommonEditor } from '../../../../commons/components';

import { Report } from '../../';

const parser = new UAParser();

const mapStateToProps = ({ fetch, security }) => {
    const userInfo = security || {};

    return{
        userInfo
    }
}

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class Comment extends React.Component {

    constructor(props) {
        super(props);

        const isLike = service.getValue(this.props, 'item.isLike', false);

        this.state = {
            isLike : isLike,
            defaultValue : '',
            visible : false,
            reportVisible : false,
            innerMode : FormMode.READ,
            modal : {
                type : '',
                title : '',
                content : ''
            }
        };

        this.renderComment = this.renderComment.bind(this);
        this.renderRead = this.renderRead.bind(this);
        this.renderWrite = this.renderWrite.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.postComment = this.postComment.bind(this);

        this.onModify = this.onModify.bind(this);
        this.offModify = this.offModify.bind(this);

        this.onModalEvent = this.onModalEvent.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);

        // likes
        this.onClickLike = this.onClickLike.bind(this);

        // report
        this.onClickReport = this.onClickReport.bind(this);
    }

    onClickReport(e){
        e && e.preventDefault();
        const { reportVisible } = this.state;
        const token = service.getValue(this.props, 'userInfo.token', false);

        if(!token){
            return this.onOpenModal({type : 'token', title : '로그인이 필요한 기능입니다.', content : '로그인 하시겠습니까?'});
        }

        return this.setState({
            reportVisible : !reportVisible
        });
    }

    componentWillReceiveProps(nextProps) {
        const { item } = this.props;

        if(JSON.parse(JSON.stringify(item)) !== JSON.parse(JSON.stringify(nextProps.item))){
            const isLike = service.getValue(nextProps, 'item.isLike', false);
            this.setState({
                isLike
            });
        }
    }

    onClickLike(e){
        e && e.preventDefault();
        const { item, match, onEvents, userInfo } = this.props;
        const { isLike } = this.state;
        const token = service.getValue(userInfo, 'token', false);
        const storyNo = service.getValue(match, 'params.id', false);
        const replyNo = service.getValue(item, 'replyNo', false);

        if(!token){
            return this.onOpenModal({type : 'token', title : '로그인이 필요한 기능입니다.', content : '로그인 하시겠습니까?'});
        }

        if(!storyNo || !replyNo){
            return;
        }

        const obj = api.postLike({
            storyNo : parseInt(storyNo, 10),
            replyNo,
            status : !isLike ? 1 : 0,
        });

        return APICaller.post(obj.url, obj.params)
            .then(({data}) => {
                const resultCode = service.getValue(data, 'resultCode', false);
                if(resultCode && resultCode === 200){
                    if(onEvents){
                        onEvents({events : 'update', payload : data})
                    }
                }
            });
    }

    getButtons(){
        const token = service.getValue(this.props, 'userInfo.token', false);

        let arr = [];
        if(token){
            arr.push({ id : FormButton.SAVE, label : '등록'});
        }else{
            arr.push({ id : FormButton.CONFIRM, label : '로그인'});
        }
        return arr;
    }

    postComment(params){
        const { events, payload } = params;
        const { item, onEvents } = this.props;
        const storyNo = service.getValue(item, 'storyNo', false);
        const replyNo = service.getValue(item, 'replyNo', false);
        const comment = service.getValue(payload, 'text', false);

        if(!storyNo || !comment){
            return;
        }

        this.setState({
            defaultValue : comment,
        });

        const newParams = events === "submit" ? {storyNo : storyNo} : {replyNo : replyNo, storyNo : storyNo};

        const obj = api.postComment({
            ...newParams,
            contents : comment,
        });

        return APICaller[events === "submit" ? "post" : "put"](obj.url, obj.params)
            .then(({data}) => {
                const resultCode = service.getValue(data, 'resultCode', false);
                if(resultCode && resultCode === 200){
                    this.setState({
                        defaultValue : '',
                        innerMode : FormMode.READ,
                    })
                    if(onEvents){
                        onEvents({events : 'update', payload : data})
                    }
                }
            });
    }

    onMove(path){
        return this.props.move(path);
    }

    onCloseModal(){
        this.setState({
            visible : false,
        })
    }

    onOpenModal(params){
        this.setState({
            visible : true,
            modal : {...params}
        })
    }

    onModalEvent(params){
        const { events } = params;

        switch (events) {
            case 'close':
                return this.onClickReport();
            default:
                break;
        }
    }

    onPress(){
        const type = service.getValue(this.state, 'modal.type', false);

        if(type){
            switch (type) {
                case 'token':
                    return this.onMove(path.login);
                case 'delete':
                    return this.onDelete();
                default:
                    break;
            }
        }
        return;
    }

    onDelete(){
        const { item, onEvents } = this.props;
        const replyNo = service.getValue(item, 'replyNo', false);
        const url = api.deleteComment(replyNo);
        return APICaller.delete(url, {})
            .then(({data}) => {
                const resultCode = service.getValue(data, 'resultCode', false);
                if(resultCode && resultCode === 200){
                    this.onCloseModal();

                    if(onEvents){
                        onEvents({events : 'update', payload : data})
                    }
                }
            })
    }

    onSubmit(params){
        const { events } = params;

        switch (events) {
            case 'submit':
                return this.postComment(params);
            case 'move':
                return this.onOpenModal({type : 'token', title : '로그인이 필요한 기능입니다.', content : '로그인 하시겠습니까?'});
            case 'cancel':
                return this.offModify();
            case 'update':
                return this.postComment(params);
            default:
                break;
        }
    }

    offModify(){
        this.setState({
            innerMode : FormMode.READ
        });
    }

    onModify(e){
        e && e.preventDefault();
        this.setState({
            innerMode : FormMode.WRITE
        })
    }

    renderInnerWrite(){
        const isMobile = parser.getDevice().type;
        return(
            <Flex.Item className="util-area">
                <Flex justify="between">
                    <Flex.Item onClick={() => this.onOpenModal({type : 'delete', title : '댓글 삭제', content : '댓글을 삭제하시겠습니까?'})} >
                        <CustomIcon
                            type="MdDeleteForever"
                            style={{marginRight: 3, color : '#2CB9CF', fontSize : '1.5em'}}
                        />{service.getWebText('삭제', isMobile)}
                    </Flex.Item>
                    <Flex.Item onClick={this.onModify}>
                        <CustomIcon
                            type="MdCreate"
                            style={{marginRight: 3, color : '#2CB9CF', fontSize : '1.5em'}}
                        />{service.getWebText('수정', isMobile)}
                    </Flex.Item>
                </Flex>
            </Flex.Item>
        )
    }

    renderUtils(){
        const { item } = this.props;
        const { isLike, innerMode } = this.state;
        const isMine = service.getValue(item, 'isMyReply', false);
        const likeCount = service.getValue(item, 'likeCount', 0);
        const isMobile = parser.getDevice().type;

        if(isMine){
            return  innerMode === FormMode.READ ? this.renderInnerWrite() : null
        }

        return(
            <div className="util-area">
                <Flex justify="end" align="top">
                    <Flex.Item onClick={this.onClickLike}>
                        <CustomIcon
                            type={isLike ? 'FaHeart' : 'FaHeartO'}
                            roots="FontAwesome"
                            style={{marginRight: 3, color : '#2CB9CF'}}
                        /><Badge text={likeCount} overflowCount={99}>{service.getWebText('좋아요', isMobile)}</Badge>
                    </Flex.Item>
                    <Flex.Item onClick={this.onClickReport} className="report">
                        <CustomIcon
                            type='MdNotificationsActive'
                            style={{marginRight: 3, color : '#2CB9CF'}}
                        />{service.getWebText('신고', isMobile)}
                    </Flex.Item>
                </Flex>
            </div>
        )
    }

    getInnerButtons(){
        return [
            { id : FormButton.CANCEL, label : '취소', type : 'normal'},
            { id : FormButton.UPDATE, label : '수정', style : { marginLeft: '5px'}}
        ]
    }

    renderRead(){
        const { item } = this.props;
        const { innerMode } = this.state;
        const updateDate = service.getValue(item, 'updateDate', false);
        const contents = service.getValue(item, 'contents', '');
        const profile = service.getValue(item, 'profileUrl', false);
        const flag = innerMode === FormMode.READ ? true : false;

        return(
            <Flex className={`comment ${innerMode === FormMode.WRITE ? 'comment-write' : ''}`}>
                <Flex.Item className="avatar-area">
                    {profile ? (<Avatar src={profile} />) : (<Avatar icon="user" />) }
                </Flex.Item>
                <Flex.Item>
                    <p className="writer">{item.username}</p>
                    <div>
                        <CommonEditor value={contents} readOnly={flag} buttons={flag ? [] : this.getInnerButtons()} onSubmit={this.onSubmit}/>
                    </div>

                    <div className="bottom">
                        { innerMode === FormMode.READ
                            ? (
                                <div className="time-area">
                                    {updateDate ? moment(updateDate).format(values.format.LOCALE_KOR) : null}
                                </div>
                            )
                            : null
                        }
                        {this.renderUtils()}
                    </div>
                </Flex.Item>
            </Flex>
        )
    }

    renderWrite(){
        const { defaultValue } = this.state;
        const token = service.getValue(this.props, 'userInfo.token', false);
        const value = token ? defaultValue : '로그인하셔야 작성할 수 있습니다.';

        return(
            <Flex className="comment comment-write" align="start">
                <Flex.Item  className="avatar-area">
                    <Avatar icon="user" size="large"/>
                </Flex.Item>
                <Flex.Item>
                    <CommonEditor ref="weditor" value={value} readOnly={token ? false : true} buttons={this.getButtons()} onSubmit={this.onSubmit} placeholder="따뜻한 마음을 표현하세요"/>
                </Flex.Item>
            </Flex>
        )
    }

    renderComment(){
        const { mode } = this.props;

        if(mode === FormMode.WRITE){
            return this.renderWrite();
        }

        return this.renderRead();
    }

    render() {
        const { item } = this.props;
        const { visible, reportVisible, modal } = this.state;

        return(
            <div className="comment-wrapper">
                {this.renderComment()}
                <Modal
                    visible={visible}
                    transparent
                    maskClosable={false}
                    title={modal.title}
                    footer={[
                        {text : 'Cancel', onPress : () => this.onCloseModal()},
                        {text : 'OK', onPress : () => this.onPress()}
                    ]}
                >
                    {modal.content}
                </Modal>
                {reportVisible ? (<Report item={item} onEvents={this.onModalEvent}/>) : null}
            </div>
        )


    }
}

Comment.propTypes = {
    mode: PropTypes.string.isRequired,
};

Comment.defaultProps = {
    mode : FormMode.READ,
};


export default withRouter(connect(mapStateToProps, mapDispatchProps)(Comment));
