import React from 'react';
import { createForm } from 'rc-form';

import { service, values } from '../../commons/configs';
import { FormButton } from '../../commons/types';

import { ButtonWrapper, SelectCountry } from '../../commons/components';
import { List, InputItem, WhiteSpace, Toast, WingBlank, Button, Flex } from 'antd-mobile';
import { Select } from 'antd';

const Option = Select.Option;

class JoinStep03 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled : false,
            userType : 11,
            domain : '',
        };

        this.errorToast = this.errorToast.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateBusiness = this.validateBusiness.bind(this);
        this.onChange = this.onChange.bind(this);

        this.onChangeSelect = this.onChangeSelect.bind(this);
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

            console.log("value", value);
            const { userType } = this.state;
            const { nickname, emailStep1, emailStep2, cellphone, countryCode, username, businessNumber } = value;

            if(!countryCode){
                return;
            }

            if(!errors){
                return stepProps.onSubmit({
                    cellphone : cellphone.replace(/ /gi, ""),
                    countryCode : countryCode,
                    email : `${emailStep1}@${emailStep2}`,
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
        const { form } = this.props;
        const rest = key === 'emailStep1' ? 'emailStep2' : 'emailStep1';
        const restAddress = form.getFieldValue(rest);

        console.log("value", rest, value, restAddress);

        if(!value || !restAddress){
            return this.setState({
                disabled : true,
                email : false,
            });
        }

        const join = key === 'emailStep1' ? `${value}@${restAddress}` : `${restAddress}@${value}`;

        console.log("join", join);

        if(values.validateEmail.test(join)){
            Toast.success(`사용가능한 이메일입니다.`, 3);
            return this.setState({
                disabled: false,
                email : true,
            })
        }else{
            Toast.fail('올바른 이메일 주소를 입력해주세요', 3);
            this.setState({
                disabled: true,
                email : false,
            });
        }
    }

    validateBusiness(key, value){
        // 중복체크
        if(value.length < 10){
            Toast.fail('올바른 사업자 번호를 입력해주세요', 3);
        }
    }

    onBlur(key, value){
        switch (key) {
            case 'emailStep1':
            case 'emailStep2':
                this.validateEmail(key, value);
                break;
            case 'businessNumber' :
                this.validateBusiness(key, value);
                break;
            default:
        }
    }

    getButtons(){
        const { disabled } = this.state;
        return [
            { id : FormButton.PREV, label : '이전', type : 'ghost' },
            { id : FormButton.NEXT, label : '가입', style : { marginLeft: '5px'}, disabled : disabled  },
        ];
    }

    onChangeSelect(value){
        const { form } = this.props;
        value ? form.setFieldsValue({'emailStep2' : value}) : form.setFieldsValue({'emailStep2' : ''});
        if(!value){
            return this.setState({
                email : false,
            });
        }
        this.validateEmail('emailStep2', value);
        return this.setState({
            domain : value
        });
    }

    render() {
        const { form, stepProps } = this.props;
        const { getFieldProps, getFieldError } = form;
        const { email, userType, domain } = this.state;
        const data = service.getValue(values, 'join.userType');

        console.log("domain", domain);

        return (
            <div className="join-step-wrapper step-03">
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

                    <Flex className="email-area" align="center">
                        <Flex.Item>
                            <InputItem
                                {...getFieldProps('emailStep1', {
                                    rules: [{ required: true, message: '이메일을 입력하세요'}],
                                })}
                                ref={el => this.email = el}
                                placeholder="E-mail"
                                className={email ? 'confirmation' : ''}
                                onBlur={this.onBlur.bind(this, 'emailStep1')}
                                clear={false}
                                error={!!getFieldError('emailStep1')}
                                onErrorClick={() => {
                                  alert(getFieldError('emailStep1').join('、'));
                                }}
                            />
                        </Flex.Item>
                        <Flex.Item className="mark">@</Flex.Item>
                        <Flex.Item>
                            <InputItem
                                {...getFieldProps('emailStep2', {
                                    rules: [{ required: true, message: '이메일을 입력하세요'}],
                                })}
                                placeholder="gmail.com"
                                className={email ? 'confirmation' : ''}
                                onBlur={this.onBlur.bind(this, 'emailStep2')}
                                clear={false}
                            />
                        </Flex.Item>
                        <Flex.Item className="select-area">
                            <Select defaultValue={domain} onSelect={this.onChangeSelect}>
                                {values.join.options.map((item, idx) => {
                                    return (<Option key={idx} value={item.value}>{item.label}</Option>)
                                })}
                            </Select>
                        </Flex.Item>
                    </Flex>


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
                            type="number"
                            placeholder="BusinessNumber"
                            clear
                            error={!!getFieldError('businessNumber')}
                            onBlur={this.onBlur.bind(this, 'businessNumber')}
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
