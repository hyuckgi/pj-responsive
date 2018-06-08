import React from 'react';
import { connect } from 'react-redux';

import { ButtonWrapper } from '../../commons/components';
import { upload } from '../../commons/api';
import { FormButton } from '../../commons/types';

import { Form, Input, Upload, Button, Icon } from 'antd';

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


        this.onChange = this.onChange.bind(this);
    }

    onClickNext(){
        const { stepProps } = this.props;

        stepProps.onClickNext();
    }

    onClickPrev(){
        const { stepProps } = this.props;

        stepProps.onClickPrev();
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

    onChange(...args){
        console.log("args", args);
    }

    getButtons(){
        return [
            { id : FormButton.PREV, label : "이전" },
            { id : FormButton.NEXT, label : "다음", style : { marginLeft: '5px'}},
        ];
    }

	onChangeThumnail(...args){
		console.log("args", args);
	}

	onRemove(...args){
		console.log("args", args);
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
								action="http://api.shell.pe.kr/api/files/upload"
								headers={{
									'X-Auth-Token' : localStorage.getItem('token'),
									'Content-Type': 'multipart/form-data',
								}}
								listType="picture-card"
								fileList={[]}
								onChange={this.onChangeThumnail}
								onPreview={this.handlePreview}
								onRemove={this.onRemove}
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
                        label="동영상"
                    >
                        {getFieldDecorator('contentsList.videos', {
                        })(
                            <Input placeholder="첫 문장이 가장 중요!" />
                        )}
                    </FormItem>
                </Form>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(Step02));
