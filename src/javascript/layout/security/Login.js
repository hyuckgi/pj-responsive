import React from 'react';
import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';
import { createForm } from 'rc-form';

import { security as action } from '../../redux/actions';

import { Input, Form, Icon } from 'antd';
import { Flex, WhiteSpace, Button, WingBlank, Toast} from 'antd-mobile';
import { service, path } from '../../commons/configs';

import logo from '../../../resource/commons/logo2.png';

const FormItem = Form.Item;

const mapStateToProps = ({ fetch, security }) => {
    const token = service.getValue(security, 'token', false);

    return{
        token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (params) => {
            return dispatch(action.login(params));
        },
        fail: () => {
            return dispatch(action.loginFail());
        },
        move: (location) => dispatch(push(location)),
        goBack : () => dispatch(goBack()),
        logout : () => dispatch(action.logout()),
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
        this.onClick = this.onClick.bind(this);
        this.onPressEnter = this.onPressEnter.bind(this);
    }

    login(params) {
        console.log("params", params);
        return this.props.login(params)
            .then(() => {
                const { token } = this.props;
                if(token){
                    return Toast.success(`로그인 되었습니다.`, 2, this.props.goBack());
                }else{
                    return Toast.fail(`아이디 또는 비밀번호를 확인해주세요.`, 1);
                }
            })
            .catch((err) => {
                if(err){
                    return Toast.fail(`로그인에 실패했습니다. 다시 진행해 주세요`, 1);
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
        e && e.preventDefault();
        const { form } = this.props;

        form.validateFields((errors, values) => {
            if(!errors){
                return this.login(values);
            }

            return this.errorToast(errors);
        });
    }

    onPressEnter(){
        return this.onSubmit();
    }

    onClick(e){
        e && e.preventDefault();
        return this.props.move(path.join);
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <WingBlank>
                <Flex className="login-container" align="center" justify="center">
                    <Flex.Item>
                        <div className="login-area">
                            <p className="logo">
                                <img src={logo} alt="logo" /> 9Spoons
                            </p>
                            <WhiteSpace size="lg"/>
                            <Form className="login-form">
                                <FormItem>
                                    {getFieldDecorator('userid', {
                                        rules: [{ required: true, message: '아이디를 입력하세요!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="UserID"
                                        />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('passwd', {
                                        rules: [{ required: true, message: '비밀번호를 입력하세요!' }],
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type="password"
                                            placeholder="Password"
                                            onPressEnter={this.onPressEnter}
                                        />
                                    )}
                                </FormItem>
                            </Form>
                            <WhiteSpace />
                            <Button type="primary" onClick={this.onSubmit}>로그인</Button>
                            <Button onClick={this.onClick} >회원가입</Button>
                        </div>
                    </Flex.Item>
                </Flex>
            </WingBlank>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Login));
