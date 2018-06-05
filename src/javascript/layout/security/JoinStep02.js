import React from 'react';
import { createForm } from 'rc-form';

import { APICaller } from '../../commons/api';

import { service, api } from '../../commons/configs';
import { FormButton } from '../../commons/types';

import { ButtonWrapper } from '../../commons/components';

import { List, InputItem, WhiteSpace, Toast } from 'antd-mobile';

class JoinStep02 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled : true,
        };

        this.errorToast = this.errorToast.bind(this);
        this.matchPass = this.matchPass.bind(this);
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

    onClickNext(){
        const { stepProps, form } = this.props;

        form.validateFields((errors, value) => {

            if(!errors){
                return stepProps.onClickNext({passwd : value.passwd});
            }
            return this.errorToast(errors);
        });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.PREV:
                return this.onClickPrev();
            case FormButton.NEXT:
                return this.onClickNext();
            default:
                break;
        }
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
            })
        }else{
            Toast.fail('비밀번호가 일치하지 않습니다.', 1);
            this.setState({
                disabled : true,
                [key] : false,
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

    getButtons(){
        const { disabled } = this.state;
        return [
            { id : FormButton.PREV, label : '이전', type : 'default' },
            { id : FormButton.NEXT, label : '다음', style : { marginLeft: '5px'}, disabled : disabled },
        ];
    }

    render() {
        const { form, stepProps } = this.props;
        const { getFieldProps, getFieldError } = form;
        const { passwd, confirmPasswd } = this.state;

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
                    />

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
                    />

                    <WhiteSpace size="md"/>
                </List>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(JoinStep02);
