import React from 'react';
import logo from '../../../resource/commons/logo.png';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createForm } from 'rc-form';

import {security as action} from '../../redux/actions';

import { service } from '../../commons/configs';

import { Flex, WhiteSpace, InputItem, Button, Checkbox, List, WingBlank } from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;

const localStorage = window.localStorage;


const mapDispatchToProps = (dispatch) => {
    return {
        login: ({username, password}) => {
            return dispatch(action.login({username, password}));
        },
        fail: () => {
            return dispatch(action.loginFail());
        },
        moveHome: () => dispatch(push('/')),
    }
};

class Login extends React.Component {

    state = {

    }

    constructor(props){
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
        const adminMobile = JSON.parse(localStorage.getItem("adminMobile"));
        if(service.getValue(adminMobile, 'autoLogin')) {
            this.login(adminMobile);
        }
    }

    login(params) {
        this.props.login(params)
            .then(docs => {
                console.log(params);
                if(service.getValue(params, 'autoLogin')) {
                    localStorage.removeItem("adminMobile");
                    localStorage.setItem("adminMobile", JSON.stringify(params));
                }
                this.props.moveHome('/');
            })
            .catch(err => {
                //TODO : 로그인 실패 메시지 출력
                console.log('error message =========== ', err);
                localStorage.removeItem("adminMobile");

                this.props.form.resetFields();
                this.props.fail();

                this.showModal();
            });
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({
                    usernameError: err.username ? true : false,
                    passwordError: err.password ? true : false,
                });
                console.log(err);
                return;
            }
            this.login(values);
        });
    }

    onRequestCertificationNumber() {
        console.log('onRequestCertificationNumber');
    }

    showModal(){
        alert('일치하는 아이디, 패스워드가 없습니다.');

        this.setState({
            usernameError: false,
            passwordError: false
        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        const {usernameError, passwordError} = this.state;
        return (
            <WingBlank className="login-container">
                <Flex justify="start" direction="column" wrap="nowrap" className="login-wrapper" align="center">
                    <Flex justify="center" direction="row" wrap="wrap">
                        <Flex.Item>
                            <img src={logo} alt="logo" className="logo"/>
                        </Flex.Item>
                        <WhiteSpace size="xl"/>
                        <Flex.Item>
                            <List>
                                <InputItem
                                    {...getFieldProps('username', {
                                        rules: [{ required: true, message: '아이디를 입력하세요!'}]
                                    })}
                                    placeholder="아이디"
                                    error={usernameError}
                                >아이디</InputItem>
                                <InputItem
                                    {...getFieldProps('password', {
                                        rules: [{ required: true, message: '비밀번호를 입력하세요!'}]
                                    })}
                                    type="password"
                                    placeholder="비밀번호"
                                    error={passwordError}
                                >비밀번호</InputItem>
                                <CheckboxItem {...getFieldProps('autoLogin')}>
                                    자동로그인
                                </CheckboxItem>
                            </List>
                            <WhiteSpace  size="xl"/>
                            <Button type="primary" onClick={this.onSubmit.bind(this)} >로그인</Button>
                        </Flex.Item>
                    </Flex>
                </Flex>
            </WingBlank>
        );
    }

}

export default connect(null, mapDispatchToProps)(createForm()(Login));
