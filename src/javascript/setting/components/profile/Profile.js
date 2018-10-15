import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';
import { Avatar } from 'antd';

import { APICaller, upload } from '../../../commons/api';
import { service, api, path, values } from '../../../commons/configs';
import { fetch } from '../../../redux/actions';

import { FormButton } from '../../../commons/types';
import { ButtonWrapper } from '../../../commons/components';

import { List, InputItem, WhiteSpace, Toast } from 'antd-mobile';
import { Upload, Icon, Form, Button } from 'antd';


const formItemLayout = {
	labelCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 4
		}
	},
	wrapperCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 20
		}
	},
	colon : false
};

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
        }

        this.getUser = this.getUser.bind(this);
        this.onChangeMode = this.onChangeMode.bind(this);
        this.errorToast = this.errorToast.bind(this);
        this.matchPass = this.matchPass.bind(this);
        this.renderPass = this.renderPass.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);

        this.renderProfileImage = this.renderProfileImage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

                this.setState({
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

    matchPass(){
        console.log('obj');
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

    // checkPass(key, value){
    //     const { form } = this.props;
    //     const newValue = value.replace(/ /gi, "");
    //     let txt;
    //
    //     switch (key) {
    //         case 'passwd':
    //             txt = '비밀번호';
    //             break;
    //         default:
    //
    //     }
    //
    //     if(newValue.trim()){
    //         const obj = api.checkValidate(key, {[key] : newValue.trim()});
    //
    //         return APICaller.post(obj.url, obj.params)
    //             .then(({data}) => {
    //                 if(data.resultCode !== 200){
    //                     Toast.fail(data.resultMsg, 1);
    //                     form.resetFields(key);
    //                     return this[key].focus();
    //                 }else{
    //                     Toast.success(`사용가능한 ${txt}입니다.`, 1);
    //                     return this.setState({
    //                         [key] : true,
    //                     })
    //                 }
    //             });
    //     }
    // }

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
                const profileFileNo = profileFile || service.getValue(profile, 'profileFile', 1);

                const newParams = {
                    userNo,
                    profileFileNo,
                    ...value
                }

                delete newParams['profileFile'];
                delete newParams['confirmPasswd'];

                const obj = api.getProfile(newParams);

                return APICaller.put(obj.url, obj.params)
                    .then((...args) => {
                        console.log("args", args);
                    });
            }

            return this.errorToast(errors);
        });
    }

    onClickButton(id){
        console.log("id", id);

        switch (id) {
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

        if(disabled){
            return [
                { id : FormButton.UPDATE, label : '수정'}
            ];
        }
        return [
            { id : FormButton.CONFIRM, label : '저장'},
        ];
    }

    renderPass(){
        const { form } = this.props;
        const { getFieldProps } = form;
        const { confirmPasswd } = this.state;

        return(
            <List full="true">
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
                >Confirm Password</InputItem>
            </List>
        )
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

    renderProfileImage(){
        const { profile, form } = this.props;
        const { getFieldDecorator } = form;
        const { imageUrl, loading, disabled } = this.state;

        return(
            <div className="profile-image">
                {imageUrl ? (<Avatar src={imageUrl} size={120} />) : <Avatar icon="user" size={120} />}

                {!disabled ?
                    (<Form className="btn-profile-image">
                        <FormItem
                            {...formItemLayout}
                        >
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
                                    <Button type="primary">
                                        <Icon type="plus" />
                                    </Button>
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
        const { passwd, disabled, email } = this.state;

        return (
            <div className="profile-wrapper">
                {this.renderProfileImage()}
                <List full="true">
                    <InputItem
                        value={service.getValue(profile, 'userid', '')}
                        disabled={true}
                    >ID</InputItem>

                    <WhiteSpace size="sm"/>

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

                    <InputItem
                        {...getFieldProps('passwd', {
                            rules: [{ required: true, message: '비밀번호를 입력하세요!'}],
                        })}
                        disabled={disabled}
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
                    >Password</InputItem>
                </List>

                {!disabled ? this.renderPass() : null}

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default createForm()(connect(mapStateToProps, mapDispatchProps)(Profile));
