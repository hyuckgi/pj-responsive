import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { APICaller } from '../../../commons/api';

import { Avatar } from 'antd';
import { Flex, Modal, Badge } from 'antd-mobile';

import { service, api, values, path } from '../../../commons/configs';
import { FormButton, FormMode } from '../../../commons/types';
import { CustomIcon, CommonEditor } from '../../../commons/components';

import { Report } from './';


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
        };

        this.renderComment = this.renderComment.bind(this);
        this.renderRead = this.renderRead.bind(this);
        this.renderWrite = this.renderWrite.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.postComment = this.postComment.bind(this);

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

        // if(!token){
        //     return this.onOpenModal();
        // }

        if(!reportVisible){
            this.setState({
                reportVisible : !reportVisible
            })
        }
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
        const { item, match, onEvents } = this.props;
        const { isLike } = this.state;
        const token = service.getValue(this.props, 'userInfo.token', false);
        const storyNo = service.getValue(match, 'params.id', false);
        const replyNo = service.getValue(item, 'replyNo', false);

        if(!token){
            return this.onOpenModal();
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
                if(resultCode === 200){
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

    postComment(payload){
        const { item, onEvents } = this.props;
        const storyNo = service.getValue(item, 'storyNo', false);
        const comment = service.getValue(payload, 'text', false);
        if(!storyNo || !comment){
            return;
        }

        this.setState({
            defaultValue : comment,
        });

        const obj = api.postComment({
            contents : comment,
            storyNo : storyNo,
        });

        return APICaller.post(obj.url, obj.params)
            .then(({data}) => {
                console.log("data", data);
                const resultCode = service.getValue(data, 'resultCode', false);
                if(resultCode === 200){
                    this.setState({
                        defaultValue : ''
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

    onOpenModal(){
        this.setState({
            visible : true,
        })
    }

    onSubmit(params){
        const { events, payload } = params;

        switch (events) {
            case 'submit':
                return this.postComment(payload);
            case 'move':
                return this.onOpenModal();
            default:
                break;
        }
    }

    renderRead(){
        const { item } = this.props;
        const { isLike } = this.state;
        const updateDate = service.getValue(item, 'updateDate', false);
        const contents = service.getValue(item, 'contents', '');
        const profile = service.getValue(item, 'profileUrl', false);
        const likeCount = service.getValue(item, 'likeCount', 0);

        return(
            <Flex className="comment">
                <Flex.Item style={{maxWidth : 60, textAlign : 'center'}}>
                    {profile ? (<Avatar src={profile} />) : (<Avatar icon="user" />) }
                </Flex.Item>
                <Flex.Item>
                    <p className="writer">{item.username}</p>
                    <div>
                        <CommonEditor value={contents} />
                    </div>
                    <Flex justify="between">
                        <Flex.Item>
                            {updateDate ? moment(updateDate).format(values.format.LOCALE_KOR) : null}
                        </Flex.Item>
                        <Flex.Item className="util-area">
                            <Flex justify="between">
                                <Flex.Item onClick={this.onClickLike} >
                                    <CustomIcon
                                        type={isLike ? 'FaHeart' : 'FaHeartO'}
                                        roots="FontAwesome"
                                        style={{marginRight: 3, color : '#2CB9CF'}}
                                    />좋아요
                                </Flex.Item>
                                {likeCount > 0 ?
                                    (<Flex.Item className="count">
                                        <Badge text={likeCount} overflowCount={99} />
                                    </Flex.Item>)
                                    : null}

                                <Flex.Item onClick={this.onClickReport} className="report">
                                    신고
                                </Flex.Item>
                            </Flex>
                        </Flex.Item>
                    </Flex>
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
                <Flex.Item style={{maxWidth : 100, textAlign : 'center'}}>
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
        const { visible, reportVisible } = this.state;

        return(
            <div className="comment-wrapper">
                {this.renderComment()}
                <Modal
                    visible={visible}
                    transparent
                    maskClosable={false}
                    title="로그인이 필요한 기능입니다."
                    footer={[
                        {text : 'Cancel', onPress : () => this.onCloseModal()},
                        {text : 'OK', onPress : () => this.onMove(path.login)}
                    ]}
                >
                    {`로그인 하시겠습니까?`}
                </Modal>
                {reportVisible ? (<Report />) : null}
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
