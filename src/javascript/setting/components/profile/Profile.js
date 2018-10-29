import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';
import { Avatar } from 'antd';

import { APICaller, upload } from '../../../commons/api';
import { service, api, values } from '../../../commons/configs';
import { fetch } from '../../../redux/actions';

import { FormButton } from '../../../commons/types';
import { ButtonWrapper, Password } from '../../../commons/components';

import { List, InputItem, WhiteSpace, Toast, Button } from 'antd-mobile';
import { Upload, Form } from 'antd';

const mapStateToProps = ({ fetch,  router, layout, security }) => {
    const userInfo = security || {}
    const profile = service.getValue(fetch, 'item.data', false);

    return{
        userInfo,
        profile
    }
};

const mapDispatchProps = dispatch => ({
    getItem : (url) => dispatch(fetch.get(url)),
});

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const FormItem = Form.Item;

class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading : false,
            passwd : null,
            disabled : true,
            visible : false

        }

        this.getUser = this.getUser.bind(this);
        this.onChangeMode = this.onChangeMode.bind(this);
        this.errorToast = this.errorToast.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onEvents = this.onEvents.bind(this);

        this.renderProfileImage = this.renderProfileImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.onOpenPassWord = this.onOpenPassWord.bind(this);
    }

    componentDidMount() {
        const token = service.getValue(this.props, 'userInfo.token', false);
        if(token){
            this.getUser();
        }
    }

    getUser(){
        const obj = api.getProfile();

        return this.props.getItem(obj.url)
            .then(() => {
                const { profile } = this.props;
                const profileUrl = service.getValue(profile, 'profileUrl', false);

                return this.setState({
                    profileUrl
                });
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

    validateEmail(key, value){
        if(!value){
            return;
        }

        if(values.validateEmail.test(value)){
            Toast.success(`사용가능한 이메일입니다.`, 1);
            return this.cellphone.focus();
        }else{
            Toast.fail('올바른 이메일 주소를 입력해주세요', 1);
            return this[key].focus();
        }
    }

    onEvents(params){
        const { events } = params;

        switch (events) {
            case 'close':
                return this.setState({
                    visible : false,
                });
            default:

        }
    }

    onChangeMode(disabled){
        this.setState({
            disabled,
        })
    }

    onBlur(key, value){
        switch (key) {
            case 'email':
                this.validateEmail(key, value);
                break;
            default:
        }
    }

    onSubmit(){
        const { form, profile } = this.props;
        const userNo = service.getValue(profile, 'userNo', false);

        if(!userNo){
            return;
        }

        form.validateFields((errors, value) => {

            if(!errors){
                const profileFile = service.getFileNo(service.getValue(value, 'profileFile.fileList', [])).find(item => item);
                const profileFileNo = profileFile || service.getValue(profile, 'profileFile', false);
                let newParams = {};

                if(profileFileNo){
                    newParams = {
                        userNo,
                        profileFileNo,
                        ...value
                    };
                }else{
                    newParams = {
                        userNo,
                        ...value
                    };
                }

                delete newParams['profileFile'];
                const obj = api.getProfile(newParams);

                return APICaller.put(obj.url, obj.params)
                    .then(({data}) => {
                        const resultCode = service.getValue(data, 'resultCode', false);
                        const resultMsg = service.getValue(data, 'resultMsg', '');
                        if(resultCode === 200){
                            this.getUser()
                            .then(() => {
                                this.onChangeMode(true);
                            });
                            return Toast.success('회원정보가 수정되었습니다.', 2);
                        }
                        return this.makeToast([resultMsg]);
                    });
            }

            return this.errorToast(errors);
        });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.CANCEL:
                return this.onChangeMode(true);
            case FormButton.UPDATE:
                return this.onChangeMode(false);
            case FormButton.CONFIRM :
                return this.onSubmit();
            default:
                break;
        }
    }

    getButtons(){
        const { disabled } = this.state;

        return disabled ? [{ id : FormButton.UPDATE, label : '수정'}] : [{ id : FormButton.CANCEL, label : '취소', type : 'ghost', style : {marginRight : 5} }, { id : FormButton.CONFIRM, label : '저장'}];
    }

    onChangeImage(info){
        if(info.file.status === 'uploading'){
            this.setState({ loading: true });
            return;
        }
        if(info.file.status === 'done'){
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }

    onOpenPassWord(){
        this.setState({
            visible : true,
        })
    }

    renderProfileImage(){
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { imageUrl, disabled } = this.state;

        return(
            <div className="profile-image">
                {imageUrl ? (<Avatar src={imageUrl} size={120} />) : <Avatar icon="user" size={120} />}

                {!disabled ?
                    (<Form className="btn-profile-image">
                        <FormItem>
                            {getFieldDecorator(`profileFile`, {
                            })(
                                <Upload
                                    {...upload.getProps()}
                                    accept='image/*'
                                    showUploadList={false}
                                    onChange={this.onChangeImage}
                                    data={(file) => (
                                        {
                                            type : 11,
                                            filename : service.getValue(file, 'name', '')
                                        }
                                    )}
                                >
                                    <Button type="primary" icon="plus" />
                                </Upload>
                            )}
                        </FormItem>
                    </Form>)
                    : null
                }
            </div>
        )
    }

    render() {
        const { form, profile } = this.props;
        const { getFieldProps, getFieldError } = form;
        const { disabled, email, visible } = this.state;

        return (
            <div className="profile-wrapper">
                {this.renderProfileImage()}
                <List full="true">
                    <InputItem
                        className="id"
                        value={service.getValue(profile, 'userid', '')}
                        disabled={true}
                    >ID</InputItem>

                    <WhiteSpace size="sm"/>

                    <List.Item
                        className="password"
                        extra={<Button type="ghost" size="small" inline onClick={this.onOpenPassWord}>비밀번호 변경하기</Button>}
                    >비밀번호</List.Item>

                    <InputItem
                        {...getFieldProps('nickname', {
                            rules: [{ required: true, message: '닉네임을 입력하세요'}],
                            initialValue : service.getValue(profile, 'nickname', ''),
                        })}
                        disabled={disabled}
                        placeholder="Nickname"
                        clear
                        error={!!getFieldError('nickname')}
                        onErrorClick={() => {
                          alert(getFieldError('nickname').join('、'));
                        }}
                    >Nickname</InputItem>

                    <WhiteSpace size="sm"/>

                    <InputItem
                        {...getFieldProps('email', {
                            rules: [{ required: true, message: '이메일을 입력하세요'}],
                            initialValue : service.getValue(profile, 'email', ''),
                        })}
                        disabled={disabled}
                        ref={el => this.email = el}
                        placeholder="E-mail"
                        className={email ? 'confirmation' : ''}
                        onBlur={this.onBlur.bind(this, 'email')}
                        clear
                        error={!!getFieldError('email')}
                        onErrorClick={() => {
                          alert(getFieldError('email').join('、'));
                        }}
                    >E-mail</InputItem>

                    <WhiteSpace size="sm"/>

                    <InputItem
                        {...getFieldProps('cellphone', {
                            rules: [{ required: true, message: '휴대폰 번호를 입력하세요'}],
                            initialValue : service.getValue(profile, 'cellphone', ''),
                        })}
                        ref={el => this.cellphone = el}
                        disabled={disabled}
                        type="phone"
                        placeholder="Cellphone Number"
                        clear
                        error={!!getFieldError('cellphone')}
                        onErrorClick={() => {
                          alert(getFieldError('cellphone').join('、'));
                        }}
                    >Cellphone</InputItem>
                </List>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
                {visible ? (<Password onEvents={this.onEvents} />) : null}
            </div>
        );
    }

}

export default createForm()(connect(mapStateToProps, mapDispatchProps)(Profile));
