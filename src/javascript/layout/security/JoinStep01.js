import React from 'react';
import { createForm } from 'rc-form';

import { APICaller } from '../../commons/api';

import { Toast, List, InputItem, WhiteSpace, Badge } from 'antd-mobile';

import { FormButton } from '../../commons/types';
import { Agreement, ButtonWrapper } from '../../commons/components';
import { api, service } from '../../commons/configs';

class JoinStep01 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmation : false,
            disabled : true,
        };
        this.errorToast = this.errorToast.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
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

    onClickNext(){
        const { stepProps, form } = this.props;

        form.validateFields((errors, value) => {

            const terms = Object.keys(value).filter(item => item.indexOf('terms') === 0)
                        .reduce((result, item) => {
                            const key = item.replace('terms_', "")
                            result[key] = value[item];
                            return result;
                        }, {});

            if(Object.keys(terms).length){
                const check = Object.keys(terms).some(item => !terms[item]);

                if(check){
                    return Toast.fail('이용약관과 개인정보 수집 및 활용에 동의해주세요.', 1)
                }
            }

            const termsCodes = Object.keys(terms).filter(item => terms[item] === true);

            if(!errors){
                return stepProps.onClickNext({userid : value.userid, termsCodes});
            }

            return this.errorToast(errors);
        });
    }

    getButtons(){
        const { disabled } = this.state;
        return [
            { id : FormButton.NEXT, label : '다음', disabled : disabled  }
        ];
    }

    onClickButton(id){
        switch (id) {
            case FormButton.NEXT:
                return this.onClickNext();
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
                        this.makeToast([data.resultMsg]);
                        form.resetFields(key);
                        return this[key].focus();
                    }else{
                        Toast.success('사용가능한 아이디 입니다.', 1);
                        return this.setState({
                            confirmation : true,
                            disabled : false,
                        })
                    }
                });
        }
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

    render() {
        const { form, stepProps } = this.props;
        const { getFieldProps, getFieldError } = form;
        const { confirmation } = this.state;


        return (
            <div className="join-step-wrapper step-01">
                <List full="true">
                    <WhiteSpace size="md"/>
                    <p className="title" style={{'textAlign': 'left', 'paddingLeft' : 15, 'marginBottom' : 0}}><Badge dot>사용하실 ID를 정하세요</Badge></p>
                    <InputItem
                        {...getFieldProps('userid', {
                            rules: [{ required: true, message: 'ID를 입력하세요'}],
                            initialValue : service.getValue(stepProps, 'data.userid', null)
                        })}
                        className={confirmation ? 'confirmation' : ''}
                        ref={el => this.userid = el}
                        placeholder="UserID(영문, 숫자 5자리 이상)"
                        clear
                        onBlur={this.onBlur.bind(this, 'userid')}
                        error={!!getFieldError('userid')}
                        onErrorClick={() => {
                          Toast.fail(getFieldError('userid').join('、'), 1);
                        }}
                    />
                    <WhiteSpace size="md"/>
                </List>

                <WhiteSpace size="lg"/>

                <Agreement
                    form={form}
                />

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(JoinStep01);
