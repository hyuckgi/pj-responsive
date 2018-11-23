import React from 'react';

import { Input, Select, Checkbox, Form } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class MakeAccount extends React.Component {

    render() {
        const { form, decorator, root } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className="make-account-wrapper">
                <Form layout="inline">
                    <FormItem
                        wrapperCol={{ span : 24 }}
                    >
                        {getFieldDecorator(`${decorator}.bankName`, {
                            rules: [{ required: true, message: '은행을 선택하세요' }],
                        })(
                            <Select
                                placeholder="은행명"
                                style={{ width: '100%' }}
                            >
                                <Option value="1">국민은행</Option>
                                <Option value="2">국민은행2</Option>
                                <Option value="3">국민은행3</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{ span: 24 }}
                    >
                        {getFieldDecorator(`${decorator}.depositor`, {
                            rules: [{ required: true, message: '예금주명을 입력하세요.' }],
                        })(
                            <Input type="text" placeholder="예금주명" />
                        )}
                    </FormItem>
                </Form>
                <Form>
                    <FormItem className="bank-number">
                        {getFieldDecorator(`${decorator}.number`, {
                            rules: [
                                { required: true, message: '계좌번호를 입력하세요' },
                                {pattern : /^[0-9]*$/, message : '숫자만 입력해주세요'}
                            ],
                        })(
                            <Input placeholder="계좌번호(-생략)" />
                        )}
                    </FormItem>
                    {!root
                        ? (<FormItem>
                            {getFieldDecorator(`${decorator}.IsFrequent`, {
                                initialValue : false,
                            })(
                                <Checkbox >자주 쓰는 계좌로 등록</Checkbox>
                            )}
                        </FormItem>)
                        : null
                    }
                </Form>
            </div>
        );
    }

}

export default MakeAccount;
