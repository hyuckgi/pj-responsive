import React from 'react';
import { connect } from 'react-redux';

import { ButtonWrapper } from '../../commons/components';
import { upload } from '../../commons/api';
import { service } from '../../commons/configs';
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
	},
	colon : false
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
			file : {},
            image : [],
			images : [],
			videos : [],
			disabled : true,
        }


        this.onChange = this.onChange.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
		this.onRemove = this.onRemove.bind(this);
    }

    onChange(type, params) {
        return this.setState({
			[type] : params.fileList
		});
    }

	onRemove(type, file){
		const target = service.getValue(this.state, `${type}`, false);

		if(!target){
			return;
		}
		return true;
	}

    onClickNext(){
        const { stepProps, form } = this.props;
		form.validateFields((errors, value) => {

			if(!errors){

				this.setState({
					disabled : false,
				})

				const newContent = {
					...value.contentsList,
					imageNoList : service.getFileNo(service.getValue(value, 'contentsList.images.fileList'), []),
					videoNoList : service.getFileNo(service.getValue(value, 'contentsList.videos.fileList'), []),
				};
				delete newContent['images'];
				delete newContent['videos'];

				const newValue = {
					contentsList : [newContent],
					imageNo : service.getFileNo(service.getValue(value, 'image.fileList'), []).find(item => item),
					title : value.title,
				}

				return stepProps.onClickNext(newValue);
			}else{
				this.setState({
					disabled : true,
				})
			}
		});
    }

    onClickPrev(){
        const { stepProps } = this.props;

        stepProps.onClickPrev();
    }

    beforeUpload(type, params){
		const file = params.file;

        this.setState({
            file : {
				...this.state.file,
				[type] : file,
			},
        });
        return true;
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
		const { disabled } = this.state;
        return [
            { id : FormButton.PREV, label : "이전", type : 'default'  },
            { id : FormButton.NEXT, label : "다음", style : { marginLeft: '5px'}, disabled : disabled},
        ];
    }

    render() {
        const { form } = this.props;
		const { file, image, images, videos } = this.state;
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
                        })(
							<Upload
								{...upload.getProps(image)}
								accept='image/*'
                                fileList={image}
								listType="picture-card"
                                onChange={(params) => this.onChange('image', params)}
                                beforeUpload={(params) => this.beforeUpload('image', params)}
								onRemove={(params) => this.onRemove('image', params)}
                                data={{
                                    type : 11,
									file : file['image'],
									filename : service.getValue(file, 'image.name', '')
                                }}
							>
								{image.length < 1
									? (<div>
								        <Icon type="plus" />
								        <div className="ant-upload-text">Upload</div>
									 </div>)
									: null
								}
							</Upload>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="소제목"
                    >
                        {getFieldDecorator('contentsList.title', {
							rules: [{ required: true, message: '소제목을 입력하세요' }],
                        })(
                            <Input placeholder="소제목을 입력하세요" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="본문"
                    >
						{getFieldDecorator('contentsList.contents', {
							rules: [{ required: true, message: '본문을 입력하세요' }]
                        })(
							<TextArea
								placeholder="본문을 입력하세요"
	                            rows={8}
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
								{...upload.getProps(images)}
								accept='image/*'
                                fileList={images}
								listType="picture-card"
                                onChange={(params) => this.onChange('images', params)}
                                beforeUpload={(params) => this.beforeUpload('images', params)}
								onRemove={(params) => this.onRemove('images', params)}
                                data={{
                                    type : 11,
									file : this.state.file['images'],
									filename : service.getValue(this.state, 'file.images.name', '')
                                }}
							>
								{images.length < 4
									? (<div>
								        <Icon type="plus" />
								        <div className="ant-upload-text">Upload</div>
									 </div>)
									: null
								}
							</Upload>
                        )}
                    </FormItem>
					<FormItem
                        {...formItemLayout}
                        label="동영상"
                    >
                        {getFieldDecorator('contentsList.videos', {
                        })(
							<Upload
								{...upload.getProps(videos)}
								accept='video/*'
                                fileList={videos}
								listType="text"
                                onChange={(params) => this.onChange('videos', params)}
                                beforeUpload={(params) => this.beforeUpload('videos', params)}
								onRemove={(params) => this.onRemove('videos', params)}
                                data={{
                                    type : 12,
									file : this.state.file['videos'],
									filename : service.getValue(this.state, 'file.videos.name', '')
                                }}
							>
								{videos.length < 4
									? (<Button>
								        <Icon type="upload" />Upload
									 </Button>)
									: null
								}
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
