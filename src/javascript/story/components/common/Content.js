import React from 'react';

import { upload } from '../../../commons/api';
import { service, values } from '../../../commons/configs';
import { FormButton } from '../../../commons/types';

import { Form, Input, Button, Upload, Icon, Select } from 'antd';

import { ButtonWrapper, CustomIcon  } from '../../../commons/components';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

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

class Content extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: {},
			images : [],
			videos : [],
        };

        this.onChange = this.onChange.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.onRemove = this.onRemove.bind(this);
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

    getButtons(){
        const { inx, length } = this.props;
        const create = [{ id : FormButton.CREATE, label : "추가", type : 'primary', icon : (<CustomIcon type="MdAdd" />) }];
        const remove = [{ id : FormButton.DELETE, label : "삭제", type : 'ghost', icon : (<CustomIcon type="MdDeleteForever" />), style : { marginLeft: '5px'}}];

        if(length === 1 && inx === 0){
            return create;
        }else if(length > 1 && length - 1 === inx){
            return create.concat(remove);
        }else{
            return [];
        }
    }

    onClickButton(id){
        switch (id) {
            case FormButton.CREATE:
                return this.props.onCreate();
            case FormButton.DELETE:
                return this.props.onRemove();
            default:
                break;
        }
    }

    render() {
        const { form, inx } = this.props;
        const { getFieldDecorator } = form;
        const { images, videos } = this.state;
        const selectBefore = (
          <Select defaultValue="Http://" style={{ width: 100 }}>
            <Option value="Http://">Http://</Option>
            <Option value="Https://">Https://</Option>
          </Select>
        );

        return (
            <div className="content-item">
                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="소제목"
                    >
                        {getFieldDecorator(`contentsList.${inx}.title`, {
                            rules: [{ required: true, message: '소제목을 입력하세요' }],
                        })(
                            <Input placeholder="소제목을 입력하세요" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="본문"
                    >
                        {getFieldDecorator(`contentsList.${inx}.contents`, {
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
                        {getFieldDecorator(`contentsList.${inx}.images`, {
                        })(
                            <Upload
                                {...upload.getProps()}
                                accept='image/*'
                                fileList={images}
                                listType="picture-card"
                                onChange={(params) => this.onChange('images', params)}
                                beforeUpload={(params) => this.beforeUpload('images', params)}
                                onRemove={(params) => this.onRemove('images', params)}
                                data={(file) => (
                                    {
                                        type : 11,
                                        filename : service.getValue(file, 'name', '')
                                    }
                                )}
                            >
                                {images.length < 9
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
                        {getFieldDecorator(`contentsList.${inx}.videoUrl`, {
                            rules : [{pattern : values.validateUrl, message : '올바른 URL형식이 아닙니다.'}]
                        })(
                            <Input
                                addonBefore={selectBefore}
                                placeholder="mysite.com"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label=" "
                    >
                        {getFieldDecorator(`contentsList.${inx}.videos`, {
                        })(
                            <Upload
                                {...upload.getProps()}
                                accept='video/*'
                                fileList={videos}
                                listType="text"
                                onChange={(params) => this.onChange('videos', params)}
                                beforeUpload={(params) => this.beforeUpload('videos', params)}
                                onRemove={(params) => this.onRemove('videos', params)}
                                data={(file) => ({
                                    type : 12,
                                    filename : service.getValue(file, 'name', '')
                                })}
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
            </div>

        );
    }

}

export default Content;
