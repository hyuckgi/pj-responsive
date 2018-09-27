import React from 'react';

import { upload } from '../../api';
import { service} from '../../configs';

import { Form, Input, Button, Upload, Icon } from 'antd';

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
        };

        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onChange(params){
        return this.setState({
            videos : params.fileList.slice(-1),
        });
    }

    handleChange(e){
        this.setState({
            title : e.target.value
        })
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { videos, title } = this.state;
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
                        label="광고영상"
                        className="video"
                    >
                        {getFieldDecorator(`adFile`, {
                            rules: [{ required: item ? false : true, message: '광고영상을 등록하세요' }],
                        })(
                            <Upload
                                {...upload}
                                accept='video/*'
                                fileList={videos}
                                listType="text"
                                onChange={this.onChange}
                                data={(file) => ({
                                    type : 22,
                                    filename : service.getValue(file, 'name', '')
                                })}
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
