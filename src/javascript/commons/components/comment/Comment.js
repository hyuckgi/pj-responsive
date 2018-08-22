import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { APICaller } from '../../../commons/api';

import { Avatar } from 'antd';
import { Flex } from 'antd-mobile';

import { service, api, values, path } from '../../../commons/configs';
import { FormButton } from '../../../commons/types';
import { CustomIcon, CommonEditor } from '../../../commons/components';


const mapStateToProps = ({ fetch }) => {
    return{

    }
}

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            likes : true,
            defaultValue : '',
        };

        this.renderComment = this.renderComment.bind(this);
        this.renderRead = this.renderRead.bind(this);
        this.renderWrite = this.renderWrite.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.postComment = this.postComment.bind(this);
    }

    onClickReport(...args){
        console.log("obj", args);
    }

    onClickLike(...args){
        console.log("args", args);
    }

    getButtons(){
        const { userInfo } = this.props;
        const token = service.getValue(userInfo, 'token', false);

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

    onMove(){
        return this.props.move(path.login);
    }

    onSubmit(params){
        const { events, payload } = params;

        switch (events) {
            case 'submit':
                return this.postComment(payload);
            case 'move':
                return this.onMove();
            default:
                break;
        }
    }

    renderRead(){
        const { item } = this.props;
        const { likes } = this.props;
        const updateDate = service.getValue(item, 'updateDate', false);
        const contents = service.getValue(item, 'contents', '');

        return(
            <Flex className="comment">
                <Flex.Item style={{maxWidth : 60, textAlign : 'center'}}>
                    <Avatar src={item.profileUrl || null} />
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
                            <Flex justify="center">
                                <Flex.Item onClick={this.onClickLike} >
                                    <CustomIcon
                                        type={likes ? 'FaHeart' : 'FaHeartO'}
                                        roots="FontAwesome"
                                        style={{marginRight: 3, color : '#2CB9CF'}}
                                    />좋아요
                                </Flex.Item>
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

    renderWrite(userInfo){
        const { defaultValue } = this.state;
        const token = service.getValue(userInfo, 'token', false);
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
        const userInfo = service.getValue(this.props, 'userInfo', false);

        if(userInfo){
            return this.renderWrite(userInfo);
        }
        return this.renderRead();
    }


    render() {
        return this.renderComment();
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Comment);
