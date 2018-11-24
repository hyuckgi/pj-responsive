import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { APICaller } from '../../../api';
import { api, service, path } from '../../../configs';
import { FormButton } from '../../../types';
import { CustomIcon, ButtonWrapper, VideoPlayer } from '../../../components';

import { Flex, List, Modal } from 'antd-mobile';

import NoImg from '../../../../../resource/commons/no_image_available.png';

const alert = Modal.alert;

const mapStateToProps = ({ security }) => {
    const userInfo = security || {};

    return{
        userInfo,
    }
}

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});


class Item extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : false,
        }

        this.getButtons = this.getButtons.bind(this);
        this.onClickButton = this.onClickButton.bind(this);

        // modal
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
        //func
        this.onEvents = this.onEvents.bind(this);

        //video
        this.onStart = this.onStart.bind(this);
        this.onEnded = this.onEnded.bind(this);
    }

    onCloseModal(){
        this.setState({
            visible : false,
        });
    }

    onOpenModal(){
        const { userInfo } = this.props;
        const token = service.getValue(userInfo, 'token', false);

        if(!token){
            return alert('로그인이 필요한 기능입니다.', `로그인 하시겠습니까?`, [
                { text: 'Cancel'},
                { text: 'Ok', onPress: () => this.props.move(path.login) },
            ]);
        }

        this.setState({
            visible : true,
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
        const { item } = this.props;
        const contractNo = service.getValue(item, 'contractNo', false);

        const obj = api.donateAD({contractNo});

        console.log("obj", obj);

        return APICaller.post(obj.url, obj.params)
            .then(({data}) => {
                const resultCode = service.getValue(data, 'resultCode', 0);
                if(resultCode === 200){
                    this.setState({
                        donateNo : data.donateNo || null,
                    });
                }
            });
    }

    onEnded(){
        const { item } = this.props;
        const { donateNo } = this.state;

        const obj = api.donateAD({donateNo});

        return APICaller.put(obj.url, obj.params)
            .then(({data}) => {
                const resultCode = service.getValue(data, 'resultCode', 0);
                if(resultCode === 200){
                    return alert('기부 성공', `${service.getValue(item, 'donationPerTime', 0)}원을 기부했습니다.`, [
                        { text: 'Ok', onPress: () => this.onCloseModal() },
                    ]);
                }
                return alert('기부 실패', `${service.getValue(data, 'resultMsg', '')}`, [
                    { text: 'Ok', onPress: () => this.onCloseModal() },
                ]);
            });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.CONFIRM :
                return this.onOpenModal();
            default:
                break;
        }
    }

    getButtons(){
        return [{ id : FormButton.CONFIRM, label : service.getWebText('기부하기'), icon : (<CustomIcon type="FaHeartbeat" roots="FontAwesome"/>), size : 'small', inline : true}];
    }

    render() {
        const { item } = this.props;
        const { visible } = this.state;
        const playTime = service.getValue(item, 'playTime', 0);
        const duration = moment.duration(playTime, 's');
        const url = service.getValue(item, 'videoUrl');

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
                    ref="modal"
                    visible={visible}
                    transparent={false}
                    maskClosable={false}
                    closable={true}
                    wrapClassName={service.getMobileClassName('fullscreen-modal')}
                    title={''}
                    onClose={this.onCloseModal}
                >
                    <VideoPlayer url={url} onEvents={this.onEvents} fullscreen={true} />
                </Modal>
            </List.Item>
        )
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Item);
