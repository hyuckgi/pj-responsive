import React from 'react';
import { createForm } from 'rc-form';

import { service } from '../../commons/configs';
import { FormButton } from '../../commons/types';

import { ButtonWrapper, SelectCountry } from '../../commons/components';
import { List, InputItem, WhiteSpace, Toast, WingBlank } from 'antd-mobile';

class JoinStep03 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.errorToast = this.errorToast.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
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

    onClickPrev(){
        const { stepProps } = this.props;
        return stepProps.onClickPrev();
    }

    onSubmit(){
        const { stepProps, form } = this.props;

        form.validateFields((errors, value) => {

            if(!errors){
                const { nickname, email, cellphone, country, username } = value;
                return stepProps.onSubmit({
                    cellphone : cellphone.replace(/ /gi, ""),
                    // TODO 서버 오탈자
                    // country_code : country.value,
                    contry_code : country.value,
                    email : email,
                    nickname : nickname,
                    username : username,
                });
            }
            return this.errorToast(errors);
        });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.PREV:
                return this.onClickPrev();
            case FormButton.NEXT:
                return this.onSubmit();
            default:
                break;
        }
    }

    validateEmail(key, value){
        if(!value){
            return;
        }

        const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        if(regex.test(value)){
            Toast.success(`사용가능한 이메일입니다.`, 1);
            return this.setState({
                [key] : true,
            })
        }else{
            Toast.fail('올바른 이메일 주소를 입력해주세요', 1);
            this.setState({
                [key] : false,
            });
            return this[key].focus();
        }
    }

    onBlur(key, value){
        switch (key) {
            case 'email':
                this.validateEmail(key, value);
                break;
            default:
        }
    }

    getButtons(){
        return [
            { id : FormButton.PREV, label : '이전', type : 'default' },
            { id : FormButton.NEXT, label : '가입', style : { marginLeft: '5px'} },
        ];
    }

    render() {
        const { form, stepProps } = this.props;
        const { getFieldProps, getFieldError } = form;
        const { email} = this.state;

        return (
            <div className="join-step-wrapper step-02">
                <List full="true">
                    <WhiteSpace size="md"/>

                    <InputItem
                        disabled={true}
                        value={service.getValue(stepProps, 'data.userid', '')}
                    />

                    <WhiteSpace size="sm"/>

                    <InputItem
                        disabled={true}
                        type="password"
                        value={service.getValue(stepProps, 'data.passwd', '')}
                    />

                    <WhiteSpace size="sm"/>

                    <InputItem
                        {...getFieldProps('username', {
                            rules: [{ required: true, message: '사용자명을 입력하세요'}],
                        })}
                        placeholder="Username"
                        clear
                        error={!!getFieldError('username')}
                        onErrorClick={() => {
                          alert(getFieldError('username').join('、'));
                        }}
                    />

                    <WhiteSpace size="sm"/>

                    <InputItem
                        {...getFieldProps('nickname', {
                            rules: [{ required: true, message: '닉네임을 입력하세요'}],
                        })}
                        placeholder="Nickname"
                        clear
                        error={!!getFieldError('nickname')}
                        onErrorClick={() => {
                          alert(getFieldError('nickname').join('、'));
                        }}
                    />

                    <WhiteSpace size="md"/>

                    <WingBlank>
                        <SelectCountry form={form} />
                    </WingBlank>

                    <WhiteSpace size="sm"/>

                    <InputItem
                        {...getFieldProps('cellphone', {
                            rules: [{ required: true, message: '휴대폰 번호를 입력하세요'}],
                        })}
                        type="phone"
                        placeholder="Cellphone Number"
                        clear
                        error={!!getFieldError('cellphone')}
                        onErrorClick={() => {
                          alert(getFieldError('cellphone').join('、'));
                        }}
                    />

                    <WhiteSpace size="sm"/>

                    <InputItem
                        {...getFieldProps('email', {
                            rules: [{ required: true, message: '이메일을 입력하세요'}],
                        })}
                        ref={el => this.email = el}
                        placeholder="E-mail"
                        className={email ? 'confirmation' : ''}
                        onBlur={this.onBlur.bind(this, 'email')}
                        clear
                        error={!!getFieldError('email')}
                        onErrorClick={() => {
                          alert(getFieldError('email').join('、'));
                        }}
                    />

                    <WhiteSpace size="md"/>
                </List>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(JoinStep03);
