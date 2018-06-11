import React from 'react';
import { connect } from 'react-redux';

import { ButtonWrapper } from '../../commons/components';
import { APICaller, upload } from '../../commons/api';
import { FormButton } from '../../commons/types';

import { Form, Input, Button, Upload, Icon } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

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
	}
};


const mapStateToProps = ({fetch, code}) => {
    // const categories = service.getValue(code, 'categories', [])

    return {
        // categories
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Step02 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            image : [],
            fileList : []
        }

        this.onChange = this.onChange.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.customRequest = this.customRequest.bind(this);
        this.getData = this.getData.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        // this.onSuccess = this.onSuccess.bind(this);
    }

    onChange(type, params) {

        console.log("onChange", params);
        const file = params.file;
        const newState = {};
        if(file.response) {
            newState[type] = [];
        } else {
            newState[type] = params.fileList;
        }
        this.setState(newState);
    }

    onSuccess(data){
        console.log('onSuccess', data);
    }

    onClickNext(){
        const { stepProps } = this.props;

        stepProps.onClickNext();
    }

    onClickPrev(){
        const { stepProps } = this.props;

        stepProps.onClickPrev();
    }

    getData(file){
        console.log("file", file);
        return {
            type : 11,
            file : file,
            filename : file.name
        }
    }

    beforeUpload(file){
        this.setState({
            file : file,
            filename : file.name
        });

        return true;
    }

    onProgress(...args){
        // console.log('onProgress', `${percent}%`, file.name);
        console.log('onProgress', args);
    }

    customRequest2(params){
        console.log('customRequest', params);
    }

    customRequest(params){

        console.log('customRequest', params);
        const { file } = params;
        params.onSuccess = this.onSuccess;

        APICaller.upload(file, {
            ...params.header,
            ...params.withCredentials,
            onUploadProgress : this.onProgress.bind(this)
        })
        .then(({data}) => {
            this.onSuccess(data)
        })
        .catch((err) => {
            console.log("err", err);
        })

        return {
            abort(...args){
                console.log('obj', args);
            }
        }
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

    getButtons(){
        return [
            { id : FormButton.PREV, label : "이전" },
            { id : FormButton.NEXT, label : "다음", style : { marginLeft: '5px'}},
        ];
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className="propose-step-wrapper step-02">
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="스토리 제목"
                    >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '제목을 입력하세요' }],
                        })(
                            <Input placeholder="스토리 제목" />
                        )}
                    </FormItem>
					<FormItem
                        {...formItemLayout}
                        label="대표사진"
                    >
                        {getFieldDecorator('image', {
                            rules: [{ required: true, message: '제목을 입력하세요' }],
                        })(
                            <Input placeholder="스토리 제목" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="소제목"
                    >
                        {getFieldDecorator('contentsList.title', {
							rules: [{ required: true, message: '소제목을 입력하세요' }],
                        })(
                            <Input placeholder="첫 문장이 가장 중요!" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="본문"
                    >
						{getFieldDecorator('contentsList.contents', {
							rules: [{ required: true, message: '본문을 입력하세요' }],
							initialValue : '본문'
                        })(
							<TextArea
	                            rows={4}
	                        />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="관련사진"
                    >
                        {getFieldDecorator('contentsList.images', {
                        })(
							<Upload
								accept='image/*'
                                fileList={this.state.image}
								listType="picture-card"
                                onChange={(params) => this.onChange('image', params)}
                                onSuccess={this.onSuccess}
                                name={this.state.filename}
                                beforeUpload={this.beforeUpload.bind(this)}
                                data={{
                                    type : 11,
                                    file : this.state.file,
                                    filename : this.state.filename
                                }}
                                {...upload.getProps(this.state.image)}
							>
								<div>
							        <Icon type="plus" />
							        <div className="ant-upload-text">Upload</div>
								</div>
							</Upload>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="관련사진"
                    >
                        {getFieldDecorator('contentsList.image', {
                        })(
							<Upload
                                {...upload.getProps([])}
                                customRequest={this.customRequest}
                                fileList={this.state.image}
								accept='image/*'
								listType="picture-card"
                                onChange={(params) => this.onChange('image', params)}
                                data={this.getData}
							>
								<div>
							        <Icon type="plus" />
							        <div className="ant-upload-text">Upload</div>
								</div>
							</Upload>
                        )}
                    </FormItem>
                </Form>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(Step02));
