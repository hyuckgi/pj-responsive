import React from 'react';

import { Flex } from 'antd-mobile';
import { Form, InputNumber, Checkbox } from 'antd';

import { service } from '../../../configs';

const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 6
		}
	},
	wrapperCol: {
		xs: {
			span: 24
		},
		sm: {
			span: 18
		}
	},
	colon : false
};


class Link extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            time : 10,
            count : 100,
        }

        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeCount = this.onChangeCount.bind(this);
    }

    onChangeTime(value){
        this.setState({
            time : value
        });
    }

    onChangeCount(value){
        this.setState({
            count : value
        });
    }

    render() {
        const { form } = this.props;
        const { time, count } = this.state;
        const { getFieldDecorator } = form;

        return (
            <Flex direction="column" align="start" className="link-item">
                <Flex.Item >
                    <FormItem
                        {...formItemLayout}
                        label="회당 기부금액"
                    >
                        {getFieldDecorator('donationPerTime', {
							rules: [{ required: true, message: '회당 기부금액을 입력하세요' }],
                            initialValue : 10,
                        })(
                            <InputNumber
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								min={10}
								step={10}
								style={{width : '100%'}}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								placeholder="회당 기부금액"
                                onChange={this.onChangeTime}
							/>
                        )}
                    </FormItem>
                </Flex.Item>
                <Flex.Item>
                    <FormItem
                        {...formItemLayout}
                        label="기부 가능횟수"
                    >
                        {getFieldDecorator('possibleDnoteCount', {
							rules: [{ required: true, message: '기부 가능횟수를 입력하세요' }],
                            initialValue : 100
                        })(
                            <InputNumber
								min={100}
								step={10}
								style={{width : '100%'}}
								placeholder="기부 가능횟수"
                                onChange={this.onChangeCount}
							/>
                        )}
                    </FormItem>
                </Flex.Item>
                <Flex.Item className="total">
                    {`총 스폰서 금액 : ${service.amount(time * count)} 원`}
                </Flex.Item>
                <Flex.Item>
                    <FormItem
                        className="reg-agree-checkbox"
                    >
                        {getFieldDecorator('isSponsorAgreement', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>스폰서 약관 및 정책에 동의합니다.</Checkbox>
                        )}
                    </FormItem>
                </Flex.Item>

            </Flex>
        );
    }

}

export default Link;
