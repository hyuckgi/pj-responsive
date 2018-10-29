import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';

import { APICaller } from '../../../commons/api';
import { Modal, List, InputItem, Toast, WhiteSpace } from 'antd-mobile';
import { service, api } from '../../configs';

const mapStateToProps = ({fetch}) => {
    const profile = service.getValue(fetch, 'item.data', false);

    return {
        profile,
    }
};

class Password extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : true,
            onReady : false
        };

        this.onClose = this.onClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.makeToast = this.makeToast.bind(this);
        this.errorToast = this.errorToast.bind(this);

        this.onBlur = this.onBlur.bind(this);
        this.checkPass = this.checkPass.bind(this);
        this.matchPass = this.matchPass.bind(this);

        this.renderFooter = this.renderFooter.bind(this);
    }

    makeToast(messages){
        const duration = messages.length;
        return Toast.fail(
            (<div>
                {messages.map((message, idx) => {
                    return (<p key={idx}>{message}</p>)
                })}
            </div>)
            , duration
        );
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

        return this.makeToast(messages);
    }

    onClose(){
        const { onEvents } = this.props;

        this.setState({
            visible : false,
        }, () => {
            onEvents({events : 'close'})
        })
    }

    onSubmit(){
        const { form } = this.props;
        const userNo = service.getValue(this.props, 'profile.userNo', false);

        if(!userNo){
            return;
        }

        form.validateFields((errors, value) => {
            if(!errors){
                const obj = api.getProfile({userNo, passwd : value.passwd});
                return APICaller.put(obj.url, obj.params)
                    .then(({data}) => {
                        const resultCode = service.getValue(data, 'resultCode', false);
                        const resultMsg = service.getValue(data, 'resultMsg', false);
                        if(resultCode === 200){
                            return this.makeToast(['비밀번호가 변경되었습니다.']);
                        }
                        return this.makeToast([resultMsg]);
                    });
            }

            return this.errorToast(errors);
        });
    }

    checkPass(key, value){
        const { form } = this.props;
        const newValue = value.replace(/ /gi, "");
        let txt;

        switch (key) {
            case 'passwd':
                txt = '비밀번호';
                break;
            default:

        }

        if(newValue.trim()){
            const obj = api.checkValidate(key, {[key] : newValue.trim()});

            return APICaller.post(obj.url, obj.params)
                .then(({data}) => {
                    if(data.resultCode !== 200){
                        Toast.fail(data.resultMsg, 1);
                        form.resetFields(key);
                        return this[key].focus();
                    }else{
                        Toast.success(`사용가능한 ${txt}입니다.`, 1);
                        return this.setState({
                            [key] : true,
                        })
                    }
                });
        }
    }

    matchPass(key, value){
        const { form } = this.props;
        const pass = form.getFieldValue('passwd');

        if(!value){
            return
        }

        if(value === pass){
            return this.setState({
                disabled : false,
                [key] : true,
                onReady : true,
            })
        }else{
            Toast.fail('비밀번호가 일치하지 않습니다.', 1);
            this.setState({
                disabled : true,
                [key] : false,
                onReady : false,
            });
            form.resetFields(key);
            return this[key].focus();
        }
    }

    onBlur(key, value){
        switch (key) {
            case 'passwd':
                this.checkPass(key, value);
                break;
            case 'confirmPasswd':
                this.matchPass(key, value);
                break;
            default:
        }
    }

    renderFooter(){
        const { onReady } = this.state;
        const buttons = [
            {text : 'Cancel', onPress : () => this.onClose()},
            {text : 'OK', onPress : () => this.onSubmit()}
        ];

        return onReady ? buttons : [buttons[0]];
    }

    render() {
        const { visible, passwd, confirmPasswd } = this.state;
        const { form } = this.props;
        const { getFieldProps, getFieldError } = form;
        const isMobile = service.isMobile();

        return (
            <Modal
                visible={visible}
                closable={true}
                className={service.getMobileClassName("password-wrapper")}
                transparent={isMobile ? false : true}
                popup={isMobile ? true : false}
                animationType={isMobile ? 'slide-up' : 'fade'}
                maskClosable={false}
                onClose={this.onClose}
                title="비밀번호 변경"
                footer={this.renderFooter()}
            >
                <List full="true">

                    <InputItem
                        {...getFieldProps('passwd', {
                            rules: [{ required: true, message: '비밀번호를 입력하세요!'}],
                        })}
                        type="password"
                        ref={el => this.passwd = el}
                        placeholder="Password"
                        className={passwd ? 'confirmation' : ''}
                        clear
                        onBlur={this.onBlur.bind(this, 'passwd')}
                        error={!!getFieldError('passwd')}
                        onErrorClick={() => {
                          alert(getFieldError('passwd').join('、'));
                        }}
                    >변경할 비밀번호</InputItem>

                    <WhiteSpace size="sm"/>

                    <InputItem
                        {...getFieldProps('confirmPasswd', {
                            rules: [{ required: true, message: '비밀번호를 재입력하세요!'}],
                        })}
                        type="password"
                        ref={el => this.confirmPasswd = el}
                        placeholder="Confirm Password"
                        className={confirmPasswd ? 'confirmation' : ''}
                        clear
                        onBlur={this.onBlur.bind(this, 'confirmPasswd')}
                    >비밀번호 확인</InputItem>

                    <WhiteSpace size="md"/>
                </List>
            </Modal>
        );
    }

}

export default connect(mapStateToProps)(createForm()(Password));
