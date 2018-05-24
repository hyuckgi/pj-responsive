import React from 'react';
import { createForm } from 'rc-form';

import { APICaller } from '../../commons/api';

import { Toast, List, InputItem, Badge, WhiteSpace } from 'antd-mobile';

import { FormButton } from '../../commons/types';
import { Agreement, ButtonWrapper } from '../../commons/components';
import { service, api } from '../../commons/configs';

class JoinStep01 extends React.Component {

    constructor(props) {
        super(props);


    }


    onSubmit(){
        const { stepProps, form } = this.props;

        form.validateFields((errors, value) => {

            if(Object.keys(value).length){
                const check = Object.keys(value).some(item => !value[item]);
                if(check){
                    return Toast.fail('이용약관과 개인정보 수집 및 활용에 동의해주세요.', 1)
                }
            }

            if(!errors){
                let data = {};
                data = {...value};
                return stepProps.onSubmit(data);
            }
        });
    }

    onClickNext(params){
        const { stepProps } = this.props;
        return stepProps.onClickNext(params);
    }

    getButtons(){
        return [
            { id : FormButton.NEXT, label : '다음' }
        ];
    }

    onClickButton(id){
        switch (id) {
            case FormButton.NEXT:
                return this.onSubmit();
            default:
                break;
        }
    }

    onBlur(key, value){
        const { form } = this.props;
        const newValue = value.replace(/ /gi, "");

        if(newValue.trim()){
            const obj = api.checkValidate(key, {[key] : newValue.trim()});

            return APICaller.post(obj.url, obj.params)
                .then(({data}) => {
                    if(data.resultCode !== 200){
                        Toast.fail(data.resultMsg, 1.5);
                        form.resetFields(key);
                        return this[key].focus();
                    }
                });
        }
    }

    render() {
        const { form } = this.props;
        const { getFieldProps, getFieldError } = form;

        return (
            <div className="join-step-wrapper step-01">
                <List full="true">
                    <InputItem
                        {...getFieldProps('userid', {
                            rules: [{ required: true, message: 'ID를 입력하세요'}],
                        })}
                        ref={el => this.userid = el}
                        placeholder="ID를 입력하세요"
                        clear
                        onBlur={this.onBlur.bind(this, 'userid')}
                        error={!!getFieldError('userid')}
                        onErrorClick={() => {
                          alert(getFieldError('userid').join('、'));
                        }}
                    ><Badge dot>ID</Badge></InputItem>
                </List>

                <WhiteSpace size="lg"/>

                <Agreement
                    form={this.props.form}
                />

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(JoinStep01);
