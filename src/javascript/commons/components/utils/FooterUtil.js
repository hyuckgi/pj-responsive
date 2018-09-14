import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import UAParser from 'ua-parser-js';
import { push } from 'react-router-redux';

import { APICaller } from '../../api';

import { service, api, path} from '../../configs';

import { CustomIcon } from '../';

import { Share, Sponsors } from './';
import { Report, ADList } from '../';
import { Flex, Button, Modal, Badge } from 'antd-mobile';

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


class FooterUtil extends React.Component {

    constructor(props) {
        super(props);

        const isLike = service.getValue(this.props, 'item.isLike', false);

        this.state = {
            isLike : isLike,
            visible : false,
            reportVisible : false,
            modalContent : {
                type : null,
                title : '',
                contents : '',
            },
        };

        this.onClickShare = this.onClickShare.bind(this);
        this.getModalContents = this.getModalContents.bind(this);
        this.getModalTitle = this.getModalTitle.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onClickLike = this.onClickLike.bind(this);
        this.onClickDonate = this.onClickDonate.bind(this);
        this.onClickReport = this.onClickReport.bind(this);
        this.getFooter = this.getFooter.bind(this);
        this.onPress = this.onPress.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onModalEvent = this.onModalEvent.bind(this);
        this.onSupport = this.onSupport.bind(this);
    }

    onMove(path){
        return this.props.move(path);
    }

    getModalContents(){
        const { modalContent } = this.state;
        return modalContent.contents;
    }

    getModalTitle(){
        const { modalContent } = this.state;
        return modalContent.title;
    }

    onPress(){
        const type = service.getValue(this.state, 'modalContent.type', false);

        if(type){
            switch (type) {
                case 'token':
                    return this.onMove(path.login);
                default:
                    break;
            }
        }
        return;
    }

    onCloseModal(){
        this.setState({
            visible : false,
            reportVisible : false,
        });
    }

    onOpenModal(modalContent){
        this.setState({
            visible : true,
            modalContent,
        });
    }

    onClickShare(e){
        e && e.preventDefault();
        return this.onOpenModal({
            type : null,
            title : '스토리를 공유해보세요',
            contents : (<Share />)
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

    onClickDonate(e){
        e && e.preventDefault();
        return this.onOpenModal({
            type : null,
            title : '스폰서 목록',
            contents : (<ADList />)
        })
    }

    onClickReport(e){
        e && e.preventDefault();
        const { reportVisible } = this.state;
        const token = service.getValue(this.props, 'userInfo.token', false);

        if(!token){
            return this.onOpenModal({type : 'token', title : '로그인이 필요한 기능입니다.', contents : '로그인 하시겠습니까?'});
        }

        return this.setState({
            reportVisible : !reportVisible
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { item } = this.props;
        const isLike = service.getValue(nextProps, 'item.isLike', false);
        if( item && service.getValue(item, 'isLike', false) !== isLike){
            this.setState({
                isLike
            });
        }
    }

    onClickLike(e){
        const { userInfo } = this.props;
        const token = service.getValue(userInfo, 'token', false);

        if(!token){
            return this.onOpenModal({
                type : 'token',
                title : '로그인이 필요한 기능입니다.',
                contents : '로그인 하시겠습니까?'
            });
        }

        const { isLike } = this.state;
        const itemNo = service.getValue(this.props, 'item.storyNo', false);

        if(!itemNo){
            return;
        }

        const obj = api.postLike({storyNo : itemNo, status : !isLike ? 1 : 0});

        return APICaller.post(obj.url, obj.params)
            .then(({data}) => {
                const result = service.getValue(data, 'resultCode', false);
                if(result === 200){
                    const { onEvent } = this.props;
                    if(onEvent){
                        onEvent({events: 'success', payload : {type : 'update'}});
                    }
                }
            });
    }

    getFooter(){
        const { modalContent } = this.state;
        const modalType = service.getValue(modalContent, 'type', false);

        if(modalType){
            return[
                {text : 'Cancel', onPress : () => this.onCloseModal()},
                {text : 'OK', onPress : () => this.onPress()}
            ]
        }
        return[]
    }

    onSupport(e){
        e && e.preventDefault();
        return this.onOpenModal({
            type : null,
            title : '광고 연동',
            contents : (<Sponsors />)
        })
    }

    render() {
        const { item, userInfo } = this.props;
        const { visible, isLike, modalContent, reportVisible} = this.state;
        const isMobile = parser.getDevice().type;
        const likeCount = service.getValue(item, 'likeCount', 0);
        const modalType = service.getValue(modalContent, 'type', false);
        const color = isLike ? '#2cb9cf' : '#fff';
        const role = service.getValue(userInfo, 'role', 9);
        // // TODO:  color 변화

        return (
            <div className="footer-utils-wapper">
                <Flex className="footer-utils" justify="around">
                    <Flex.Item>
                        <Button
                            icon={(<CustomIcon type={isLike ? 'FaHeart' : 'FaHeartO'} roots="FontAwesome" style={{color : color}}/>)}
                            onClick={this.onClickLike}
                        >
                            <Badge text={likeCount} style={{ marginLeft: 18, backgroundColor: color}} overflowCount={99}><span style={{color:color}}>좋아요</span></Badge>
                        </Button>
                    </Flex.Item>
                    <Flex.Item>
                        <Button
                            icon={(<CustomIcon type="MdShare"/>)}
                            onClick={this.onClickShare}
                        >공유하기</Button>
                    </Flex.Item>
                    <Flex.Item>
                        <Button
                            icon={(<CustomIcon type="MdFavorite"/>)}
                            onClick={this.onClickDonate}
                        >기부하기</Button>
                    </Flex.Item>
                    <Flex.Item className="report">
                        <Button
                            icon={(<CustomIcon type="FaThumbsDown" roots="FontAwesome" />)}
                            onClick={this.onClickReport}
                        >신고하기</Button>
                    </Flex.Item>
                    {role === 3
                        ? (
                            <Flex.Item>
                                <Button
                                    icon={(<CustomIcon type="FaChain" roots="FontAwesome" />)}
                                    onClick={this.onSupport}
                                >광고연동</Button>
                            </Flex.Item>
                        )
                        : null
                    }
                </Flex>

                <Modal
                    visible={visible}
                    transparent={isMobile ? false : true}
                    popup={isMobile ? true : false}
                    animationType={isMobile ? 'slide-up' : 'fade'}
                    maskClosable={false}
                    closable={modalType === 'token' ? false : true}
                    wrapClassName={isMobile ? `footer-util-modal footer-util-modal-mobile` : `footer-util-modal`}
                    title={this.getModalTitle()}
                    onClose={this.onCloseModal}
                    footer={this.getFooter()}
                >
                    {this.getModalContents()}
                </Modal>
                {reportVisible ? (<Report item={item} onEvents={this.onModalEvent}/>) : null}
            </div>

        );
    }
}


FooterUtil.propTypes = {
    item : PropTypes.object.isRequired,

};

FooterUtil.defaultProps = {
    item : {},
};


export default withRouter(connect(mapStateToProps, mapDispatchProps)(FooterUtil));
