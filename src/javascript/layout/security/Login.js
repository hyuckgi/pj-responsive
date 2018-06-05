import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createForm } from 'rc-form';

import {security as action} from '../../redux/actions';

import { Flex, WhiteSpace, InputItem, Button, List, WingBlank, Toast} from 'antd-mobile';

import logo from '../../../resource/commons/logo.png';

const mapDispatchToProps = (dispatch) => {
    return {
        login: (params) => {
            return dispatch(action.login(params));
        },
        fail: () => {
            return dispatch(action.loginFail());
        },
        moveHome: () => dispatch(push('/')),
    }
};

class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {

        };

        this.errorToast = this.errorToast.bind(this);
        this.makeToast = this.makeToast.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    login(params) {
        return this.props.login(params)
            .then(({token}) => {
                if(token){
                    localStorage.setItem('token', JSON.stringify(token));
                    return Toast.success(`로그인 되었습니다.`, 2, this.props.moveHome());
                }else{
                    return Toast.fail(`회원정보가 없습니다`, 1, window.location.reload());
                }
            })
            .catch((err) => {
                if(err){
                    return Toast.fail(`로그인에 실패했습니다. 다시 진행해 주세요`, 1, window.location.reload());
                }
            })
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

    onSubmit(e) {
        e.preventDefault();
        const { form } = this.props;

        form.validateFields((errors, values) => {
            if(!errors){
                return this.login(values);
            }

            return this.errorToast(errors);
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldProps } = form;

        return (
            <WingBlank className="login-container">
                <Flex justify="start" direction="column" wrap="nowrap" className="login-wrapper" align="center">
                    <Flex justify="center" direction="row" wrap="wrap">
                        <Flex.Item>
                            <img src={logo} alt="logo" className="logo"/>
                        </Flex.Item>
                        <Flex.Item>
                            <WhiteSpace size="lg"/>
                            <List>
                                <InputItem
                                    {...getFieldProps('userid', {
                                        rules: [{ required: true, message: '아이디를 입력하세요!'}]
                                    })}
                                    placeholder="UserID"
                                />
                                <InputItem
                                    {...getFieldProps('passwd', {
                                        rules: [{ required: true, message: '비밀번호를 입력하세요!'}]
                                    })}
                                    type="password"
                                    placeholder="Password"
                                />
                            </List>
                            <WhiteSpace size="lg"/>
                            <Button type="primary" onClick={this.onSubmit} >로그인</Button>
                        </Flex.Item>
                    </Flex>
                </Flex>
            </WingBlank>
        );
    }

}

export default connect(null, mapDispatchToProps)(createForm()(Login));
