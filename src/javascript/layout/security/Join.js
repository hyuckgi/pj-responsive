import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { APICaller } from '../../commons/api';

import { service, values, path, api } from '../../commons/configs';

import { Tabs, Flex, Steps, WingBlank, Modal, WhiteSpace } from 'antd-mobile';

import { JoinStep01, JoinStep02, JoinStep03 } from './';


const Step = Steps.Step;


const mapDispatchToProps = (dispatch) => ({

    moveHome: () => dispatch(push('/')),
});

class Join extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current : 0,
            visible : false,
            modalContent : {
                title : "",
                contents : "",
                url : "",
            },
        };

        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    getSteps(){
        const { current } = this.state;
        const type = service.getValue(values, 'requestType', {});
        return Object.keys(type)
            .map((item, idx) => (<Step className={current === idx ? 'active' : 'inactive'} key={idx} title={type[item].label} />));
    }

    getTabs(){
        const type = service.getValue(values, 'requestType', {});
        return Object.keys(type)
            .map((item, idx) => {
                return {title : ''}
            })
    }

    onSubmit(data){
        const { params } = this.state

        const obj = api.join({...data, ...params});

        console.log('obj', obj);

        APICaller.post(obj.url, obj.params)
        .then((...args) => {
            console.log("args", args);
        })
        // const postData = {}
        //
        // if(!service.getValue(params, 'userid', false)){
        //     console.log("다시 진행하세요.");
        //     return;
        // }
        // postData['userid'] = params.userid;
        // postData['passwd'] = params.passwd;
        // postData['username'] = data.username;
        // postData['nickname'] = data.nickname;
        // postData['cellphone'] = data.cellphone;
        // postData['email'] = data.cellphone;
        //
        // const obj = api.join({
        //
        // })




    }

    onChange(tab, idx){
        console.log("idx", idx);
    }

    onClickNext(params){
        console.log("params", params);
        const type = service.getValue(values, 'requestType', {});
        const { current } = this.state;
        const next = (current + 1) > (Object.keys(type).length - 1) ? (Object.keys(type).length - 1) : current + 1;

        return this.setState({
            current : next,
            params : {
                ...this.state.params,
                ...params
            }
        })
    }

    onClickPrev(){
        const { current } = this.state;
        const prev = (current - 1) < 0  ? 0 : current - 1;

        return this.setState({
            current : prev,
        })
    }

    onTabClick(){
        return;
    }

    onCloseModal(){
        const { modalContent } = this.state;
        this.setState({
            visible : false,
        });

        if(modalContent.url === path.home){
            return window.location.reload();
        }
        return this.props.move(modalContent.url);
    }

    getModalTitle(){
        const { modalContent } = this.state;
        return modalContent.title;
    }

    getModalContents(){
        const { modalContent } = this.state;
        return modalContent.contents;
    }

    render() {
        const { current, visible, params } = this.state;
        const stepProps = {
            data : params,
            onClickNext : this.onClickNext,
            onClickPrev : this.onClickPrev,
            onSubmit : this.onSubmit
        };

        return (
            <WingBlank className="join-container">
                <Flex justify="start" direction="column" wrap="nowrap" className="join-wrapper" align="center" >
                    <Flex justify="center" direction="row" wrap="wrap">
                        <Flex.Item>
                            <WhiteSpace size="xl" />
                            <h2 className="title">회원가입</h2>
                        </Flex.Item>

                        <Flex.Item>
                            <Steps
                                current={current}
                                direction="horizontal"
                                size="small"
                                className="request-steps"
                            >
                                {this.getSteps()}
                            </Steps>
                        </Flex.Item>

                        <Flex.Item>
                            <Tabs
                                tabs={this.getTabs()}
                                initialPage={0}
                                page={current}
                                swipeable={false}
                                onChange={this.onChange.bind(this)}
                                tabBarBackgroundColor='transparent'
                                tabBarTextStyle={{fontSize:'13px'}}
                                tabBarUnderlineStyle={{display : 'none'}}
                                destroyInactiveTab={true}
                                prerenderingSiblingsNumber={0}
                                onTabClick={this.onTabClick}
                            >
                                <JoinStep01
                                    stepProps={stepProps}
                                />

                                <JoinStep02
                                    stepProps={stepProps}
                                />

                                <JoinStep03
                                    stepProps={stepProps}
                                />
                            </Tabs>
                        </Flex.Item>
                    </Flex>
                </Flex>

                <Modal
                    visible={visible}
                    transparent
                    maskClosable={false}
                    title={this.getModalTitle()}
                    footer={[{ text: 'Ok', onPress: this.onCloseModal}]}
                >
                    {this.getModalContents()}
                </Modal>
            </WingBlank>
        );
    }

}

export default connect(null, mapDispatchToProps)(Join);
