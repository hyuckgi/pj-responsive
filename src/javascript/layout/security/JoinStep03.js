import React from 'react';
import { createForm } from 'rc-form';

import { service, values } from '../../commons/configs';
import { FormButton } from '../../commons/types';

import { ButtonWrapper, SelectCountry } from '../../commons/components';
import { List, InputItem, WhiteSpace, Toast, WingBlank, Button, Flex } from 'antd-mobile';

class JoinStep03 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled : true,
            userType : 11,
        };

        this.errorToast = this.errorToast.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(item, e){
        e && e.preventDefault();
        const userType = service.getValue(item, 'value', false);
        if(userType){
            this.setState({
                userType
            })
        };
        return;
    }

    makeToast(messages){
        const duration = messages.length * 3;
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
            const { userType } = this.state;
            const { nickname, email, cellphone, countryCode, username, businessNumber } = value;

            if(!countryCode){
                return;
            }

            if(!errors){
                return stepProps.onSubmit({
                    cellphone : cellphone.replace(/ /gi, ""),
                    countryCode : countryCode,
                    email : email,
                    nickname : nickname,
                    username : username,
                    userType : userType,
                    businessNumber : userType === 12 ? businessNumber : ''
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

        if(values.validateEmail.test(value)){
            Toast.success(`사용가능한 이메일입니다.`, 3);
            return this.setState({
                disabled: false,
                [key] : true,
            })
        }else{
            Toast.fail('올바른 이메일 주소를 입력해주세요', 3);
            this.setState({
                disabled: true,
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
        const { disabled } = this.state;
        return [
            { id : FormButton.PREV, label : '이전', type : 'default' },
            { id : FormButton.NEXT, label : '가입', style : { marginLeft: '5px'}, disabled : disabled  },
        ];
    }

    render() {
        const { form, stepProps } = this.props;
        const { getFieldProps, getFieldError } = form;
        const { email, userType } = this.state;
        const data = service.getValue(values, 'join.userType')

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

                    <WhiteSpace size="md"/>

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

                    <Flex className="flex-wrapper" align="center">
                        <Flex.Item className="plain-text" style={{maxWidth : 80, padding : 0}}>회원구분</Flex.Item>
                        <Flex.Item>
                            {data.map(item => {
                                return(
                                    <Button
                                        key={item.value}
                                        onClick={this.onChange.bind(this, item)}
                                        inline size="small"
                                        style={{marginLeft : 2, marginRight: 2, verticalAlign : 'middle'}}
                                        type={item.value === userType ? 'primary' : ''}
                                        onChange={this.onChange.bind(this, item)}
                                    >
                                        {item.label}
                                    </Button>
                                )
                            })}
                        </Flex.Item>
                    </Flex>

                    {userType === 12 && (
                        <InputItem
                            {...getFieldProps('businessNumber', {
                                rules: [{ required: userType === 12 ? true : false, message: '사업자등록번호를 입력하세요'}]
                            })}
                            type="text"
                            placeholder="BusinessNumber"
                            clear
                            error={!!getFieldError('businessNumber')}
                            onErrorClick={() => {
                              alert(getFieldError('businessNumber').join('、'));
                            }}
                        />
                    )}

                    <WhiteSpace size="md"/>
                </List>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(JoinStep03);
