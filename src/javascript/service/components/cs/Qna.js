import React from 'react';
import { createForm } from 'rc-form';

import { APICaller } from '../../../commons/api';
import { service, api } from '../../../commons/configs';
import { FormButton } from '../../../commons/types';
import { ButtonWrapper } from '../../../commons/components';

import { List, InputItem, WhiteSpace, Toast, TextareaItem } from 'antd-mobile';

class Qna extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled : true,
        };

        this.validateAccount = this.validateAccount.bind(this);
    }

    onClickButton(id){
        console.log("id", id);
    }

    getButtons(){
        const { disabled } = this.state;

        return [
            { id : FormButton.CANCEL, label : 'cancel', type : 'ghost' },
            { id : FormButton.CONFIRM, label : 'confirm', style : { marginLeft: '5px'}, disabled : disabled },
        ];
    }

    validateAccount(rule, value, callback){
    	if (value && value.length > 4) {
    		callback();
    	} else {
    		callback(new Error('At least four characters for account'));
    	}
    }

    render() {
        const { form } = this.props;
        const { getFieldProps, getFieldError } = form;

        return (
            <div className="qna-wrapper">
                <p className="title">이용문의</p>
                <List full="true">
                    <InputItem
                        {...getFieldProps('itemNo', {
                            rules: [
                                { required: true, message: 'Please select itemNo' },
                                { validator: this.validateAccount },
                            ],
                         })}
                         clear
                         error={!!getFieldError('itemNo')}
                         onErrorClick={() => {
                           alert(getFieldError('itemNo').join('、'));
                         }}
                         placeholder="temp select"
                    >분류</InputItem>

                    <InputItem
                        {...getFieldProps('email', {
                            rules: [
                                { required: true, message: 'Please input email' },
                            ],
                         })}
                         clear
                         error={!!getFieldError('email')}
                         onErrorClick={() => {
                           alert(getFieldError('email').join('、'));
                         }}
                         placeholder="please input email"
                    >E-mail</InputItem>

                    <InputItem
                        {...getFieldProps('telNo', {
                            rules: [{ required: true, message: '휴대폰 번호를 입력하세요'}],
                        })}
                        type="phone"
                        placeholder="Cellphone Number"
                        clear
                        error={!!getFieldError('telNo')}
                        onErrorClick={() => {
                          alert(getFieldError('telNo').join('、'));
                        }}
                    >전화번호</InputItem>

                    <InputItem
                        {...getFieldProps('title', {
                            rules: [
                                { required: true, message: 'Please input title' },
                            ],
                         })}
                         clear
                         error={!!getFieldError('title')}
                         onErrorClick={() => {
                           alert(getFieldError('title').join('、'));
                         }}
                         placeholder="select"
                    >문의제목</InputItem>

                    <TextareaItem
                        {...getFieldProps('contents', {
                        })}
                        title="문의내용"
                        rows={5}
                        autoHeight
                        placeholder="문의 내용을 입력하세요."
                    />
                </List>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(Qna);
