import React from 'react';
import { connect } from 'react-redux';

import { ButtonWrapper } from '../../../commons/components';
import { upload } from '../../../commons/api';
import { service } from '../../../commons/configs';
import { FormButton } from '../../../commons/types';

import { Form, Input, Upload, Icon, Alert } from 'antd';

import { ContentList } from './';

const FormItem = Form.Item;

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
            image : [],
			file : {},

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
                const newContent = service.getValue(value, 'contentsList', []).reduce((result, item) => {
                    const imageNoList = service.getFileNo(service.getValue(item, 'images.fileList', []));
                    const videoNoList = service.getFileNo(service.getValue(item, 'videos.fileList', []));

                    const newItem = {
                        ...item,
                        imageNoList,
                        videoNoList
                    }
                    delete newItem['images'];
                    delete newItem['videos'];
                    result.push(newItem);
                    return result;
                }, []);

				const newValue = {
					contentsList : [...newContent],
					imageNo : service.getFileNo(service.getValue(value, 'image.fileList', [])).find(item => item),
					title : value.title,
				}

				return stepProps.onClickNext(newValue);
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
        return [
            { id : FormButton.PREV, label : "이전", type : 'default'  },
            { id : FormButton.NEXT, label : "다음", style : { marginLeft: '5px'}},
        ];
    }

    render() {
        const { form } = this.props;
		const { image } = this.state;
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
                        <Alert message="이미지 사이즈는 640 * 360 입니다." type="info" style={{marginBottom : 10}}/>
                        {getFieldDecorator('image', {
                            rules: [{ required: true, message: '대표사진을 첨부하세요' }],
                        })(
							<Upload
                                {...upload.getProps()}
								accept='image/*'
                                fileList={image}
								listType="picture-card"
                                onChange={(params) => this.onChange('image', params)}
                                beforeUpload={(params) => this.beforeUpload('image', params)}
								onRemove={(params) => this.onRemove('image', params)}
                                data={(file) => ({
                                    type : 11,
                                    filename : service.getValue(file, 'name', '')
                                })}
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
                </Form>
                <ContentList form={form}/>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(Step02));
