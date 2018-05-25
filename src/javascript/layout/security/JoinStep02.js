import React from 'react';
import { createForm } from 'rc-form';

import { APICaller } from '../../commons/api';

import { service, api, values } from '../../commons/configs';
import { FormButton } from '../../commons/types';

import { ButtonWrapper, SelectCountry } from '../../commons/components';

import { List, InputItem, Radio, WhiteSpace, Toast, Flex, Badge } from 'antd-mobile';

class JoinStep02 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.errorToast = this.errorToast.bind(this);
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

            // if(value.birthday.trim().length !== 8){
            //     return Toast.fail('생년월일을 8자리로 입력해주세요.', 1);
            // }
            // const isBetween = moment(value.birthday, values.format.DATE_FORMAT).isBetween(startDate, endDate);
            // if(!isBetween){
            //     Toast.fail('가입가능한 연령이 아닙니다.', 1);
            //     form.resetFields('birthday');
            //     return this.birthday.focus();
            // }
            //
            // if(!errors){
            //     let params = {...value, isMale};
            //     this.setState({
            //         defaultValue : params,
            //     })
            //     return stepProps.onClickNext(params);
            // }
            // return this.errorToast(errors);
        });
    }
    //
    // onChange(value){
    //     return this.setState({
    //         isMale : value
    //     });
    // }

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

        if(newValue.trim()){
            const obj = api.checkValidate(key, {[key] : newValue.trim()});

            return APICaller.post(obj.url, obj.params)
                .then(({data}) => {
                    if(data.resultCode !== 200){
                        Toast.fail(data.resultMsg, 1);
                        form.resetFields(key);
                        return this[key].focus();
                    }
                });
        }
    }

    onBlur(key, value){
        switch (key) {
            case 'passwd':
                return this.checkPass(key, value);
                break;
            default:
        }
    }

    getButtons(){
        return [
            { id : FormButton.PREV, label : '이전', type : 'default' },
            { id : FormButton.NEXT, label : '다음', style : { marginLeft: '5px'} },
        ];
    }

    render() {
        const { form, stepProps } = this.props;
        const { getFieldProps, getFieldError } = form;
        const { isMale } = this.state;

        return (
            <div className="join-step-wrapper step-02">
                <List full="true">
                    <WhiteSpace size="md"/>

                    <InputItem
                        disabled={true}
                        value={service.getValue(stepProps, 'userid', "")}
                    />

                    <WhiteSpace size="sm"/>

                    <InputItem
                        {...getFieldProps('passwd', {
                            rules: [{ required: true, message: '비밀번호를 입력하세요!'}],
                        })}
                        type="password"
                        ref={el => this.passwd = el}
                        placeholder="Password"
                        clear
                        onBlur={this.onBlur.bind(this, 'passwd')}
                        error={!!getFieldError('passwd')}
                        onErrorClick={() => {
                          alert(getFieldError('passwd').join('、'));
                        }}
                    />

                    <WhiteSpace size="sm"/>

                    <InputItem
                        type="password"
                        ref={el => this.confirmPasswd = el}
                        placeholder="Confirm Password"
                        clear
                        onBlur={this.onBlur.bind(this, 'confirmPasswd')}
                    />

                    <SelectCountry form={form} />

                    <WhiteSpace size="md"/>
                </List>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(JoinStep02);
