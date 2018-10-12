import React from 'react';

import { upload } from '../../../api';
import { service} from '../../../configs';

import { Form, Input, Button, Upload, Icon, Modal } from 'antd';

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
			span: 16
		}
	},
	colon : false
};

class Item extends React.Component {
    constructor(props) {
        super(props);

        const title = service.getValue(this.props, 'item.name', '');
        const adNo = service.getValue(this.props, 'item.adNo', false);
        const video = service.getValue(this.props, 'item.videoUrl', false) ? [{uid : adNo, key : adNo, adNo : adNo, name : title}] : [];

        this.state = {
            videos : video,
            title : title,
            images : []
        };

        this.onChangeVideo = this.onChangeVideo.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChangeVideo(params){
        console.log("params", params);
        return this.setState({
            videos : params.fileList.slice(-1),
        });
    }

    onChangeImage(params){
        console.log("params", params);
        return this.setState({
            images : params.fileList.slice(-1),
        });
    }

    handleChange(e){
        this.setState({
            title : e.target.value
        })
    }

    onClose(){
        const { onEvents } = this.props;
        if(onEvents){
            onEvents({
                events : 'close',
            });
        }
    }

    onError(error, res, file){
        const resMsg = service.getValue(res, 'result_msg', 'errors');

        return Modal.warning({
            title: '파일업로드 중 에러가 발생했습니다.',
            content: resMsg,
            onOk : this.onClose
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { videos, title, images } = this.state;
        const item = service.getValue(this.props, 'item', false);

        return (
            <div className="ad-inner-item">
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="광고제목"
                    >
                        {getFieldDecorator(`title`, {
                            rules: [{ required: true, message: '제목을 입력하세요' }],
                            initialValue : title
                        })(
                            <Input
                                onChange={this.handleChange}
                                placeholder="제목을 입력하세요"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="대표사진"
                    >
                        {getFieldDecorator(`adImageFile`, {
                        })(
                            <Upload
                                {...upload.getProps()}
                                accept='image/*'
                                fileList={images}
                                listType="picture-card"
                                onChange={this.onChangeImage}
                                data={(file) => (
                                    {
                                        type : 11,
                                        filename : service.getValue(file, 'name', '')
                                    }
                                )}
                            >
                                {images.length < 1
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
                        label="광고영상"
                        className="video"
                    >
                        {getFieldDecorator(`adFile`, {
                            rules: [{ required: item ? false : true, message: '광고영상을 등록하세요' }],
                        })(
                            <Upload
                                {...upload.getProps()}
                                accept='video/*'
                                fileList={videos}
                                listType="text"
                                onChange={this.onChangeVideo}
                                data={(file) => ({
                                    type : 22,
                                    filename : service.getValue(file, 'name', '')
                                })}
                                onError={this.onError}
                            >
                                <Button>
                                    <Icon type="upload" />Upload
                                 </Button>
                            </Upload>
                        )}
                    </FormItem>
                </Form>
            </div>
        );
    }

}

export default Item;
