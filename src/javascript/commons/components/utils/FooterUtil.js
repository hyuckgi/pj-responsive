import React from 'react';
import PropTypes from 'prop-types';
import UAParser from 'ua-parser-js';

import { APICaller } from '../../api';

import { service, api } from '../../configs';

import { CustomIcon } from '../';

import { Share, Sponsors, Report } from './';
import { Flex, Button, Modal, Badge } from 'antd-mobile';


const parser = new UAParser();


class FooterUtil extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : false,
            modalContent : {
                title : "",
                contents : "",
            },
            likes : true,
        };

        this.onClickShare = this.onClickShare.bind(this);
        this.getModalContents = this.getModalContents.bind(this);
        this.getModalTitle = this.getModalTitle.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onClickLike = this.onClickLike.bind(this);
        this.onClickDonate = this.onClickDonate.bind(this);
        this.onClickReport = this.onClickReport.bind(this);
    }

    getModalContents(){
        const { modalContent } = this.state;
        return modalContent.contents;
    }

    getModalTitle(){
        const { modalContent } = this.state;
        return modalContent.title;
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

    onClickShare(e){
        e.preventDefault();
        return this.onOpenModal({
            title : '스토리를 공유해보세요',
            contents : (<Share />)
        })
    }

    onClickDonate(e){
        e.preventDefault();
        return this.onOpenModal({
            title : '스폰서 목록',
            contents : (<Sponsors />)
        })
    }

    onClickReport(e){
        e.preventDefault();
        const { item } = this.props;
        return this.onOpenModal({
            title : '신고하기',
            contents : (<Report item={item}/>)
        })
    }

    onClickLike(e){
        const { likes } = this.state;
        const itemNo = service.getValue(this.props, 'item.storyNo', false);
        if(!itemNo){
            return;
        }

        const obj = api.postLike({storyNo : itemNo, status : likes ? 1 : 0});
        return APICaller.post(obj.url, obj.params)
            .then(({data}) => {
                const result = service.getValue(data, 'resultCode', 400);
                if(result === 200){
                    const { onEvent } = this.props;
                    this.setState({
                        likes : false,
                    });
                    if(onEvent){
                        onEvent({events: 'success', payload : {type : 'update'}});
                    }
                }
            });
    }

    render() {
        const { item } = this.props;
        const { visible } = this.state;
        const isMobile = parser.getDevice().type;


        return (
            <div className="footer-utils-wapper">
                <Flex className="footer-utils" justify="around">
                    <Flex.Item>
                        <Button
                            icon={(<CustomIcon type="FaThumbsUp" roots="FontAwesome"/>)}
                            onClick={this.onClickLike}
                        >
                            <Badge text={item.likeCount + 1} style={{ marginLeft: 10 }} overflowCount={10000}>좋아요</Badge>
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
                    <Flex.Item>
                        <Button
                            icon={(<CustomIcon type="FaThumbsDown" roots="FontAwesome" />)}
                            onClick={this.onClickReport}
                        >신고하기</Button>
                    </Flex.Item>
                </Flex>

                <Modal
                    visible={visible}
                    transparent={isMobile ? false : true}
                    popup={isMobile ? true : false}
                    animationType={isMobile ? 'slide-up' : 'fade'}
                    maskClosable={false}
                    closable={true}
                    wrapClassName={isMobile ? `footer-util-modal footer-util-modal-mobile` : `footer-util-modal`}
                    title={this.getModalTitle()}
                    onClose={this.onCloseModal}
                >
                    {this.getModalContents()}
                </Modal>
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


export default FooterUtil;
