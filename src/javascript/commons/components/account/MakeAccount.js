import React from 'react';

import { Input, Select, Row, Col, Checkbox } from 'antd';

const Option = Select.Option;

class MakeAccount extends React.Component {

    render() {
        const { form, decorator } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className="make-account-wrapper">
                <Row type="flex" justify="space-between" align="top">
                    <Col span={6}>
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
                    </Col>
                    <Col span={17}>
                        {getFieldDecorator(`${decorator}.depositor`, {
                            rules: [{ required: true, message: '예금주명을 입력하세요.' }],
                        })(
                            <Input type="text" placeholder="예금주명" />
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {getFieldDecorator(`${decorator}.number`, {
                            rules: [{ required: true, message: '계좌번호를 입력하세요' }],
                        })(
                            <Input type="number" placeholder="계좌번호" />
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {getFieldDecorator(`${decorator}.IsFrequent`, {
                            initialValue : false,
                        })(
                            <Checkbox >자주 쓰는 계좌로 등록</Checkbox>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }

}

export default MakeAccount;
