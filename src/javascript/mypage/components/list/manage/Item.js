import React from 'react';

import { upload } from '../../../../commons/api';
import { service} from '../../../../commons/configs';

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
        this.state = {
            videos : []
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(params){
        return this.setState({
            videos : params.fileList.slice(-1),
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { videos } = this.state;
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
                            initialValue : service.getValue(item, 'title', null),
                        })(
                            <Input placeholder="제목을 입력하세요" />
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
                                {...upload.getProps(videos)}
                                accept='video/*'
                                fileList={videos}
                                listType="text"
                                onChange={this.onChange}
                                data={{
                                    type : 12,
                                    file : videos[0],
                                    filename : service.getValue(videos[0], 'name', '')
                                }}
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
