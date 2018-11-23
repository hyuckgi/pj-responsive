import React from 'react';
import { connect } from 'react-redux';

import { ButtonWrapper, AccountContainer } from '../../../commons/components';
import { FormButton } from '../../../commons/types';

import { Form, Input, Radio, InputNumber, Row, Col } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;


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


const mapStateToProps = ({fetch, code}) => {
    // const categories = service.getValue(code, 'categories', [])

    return {

    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Step03 extends React.Component {

    constructor(props) {
        super(props);

		this.onSubmit = this.onSubmit.bind(this);
		this.onClickPrev = this.onClickPrev.bind(this);
    }

    onSubmit(){
        const { stepProps, form } = this.props;
		form.validateFields((errors, value) => {
			if(!errors){
				return stepProps.onSubmit(value);
			}
		});
    }

	onClickPrev(){
		const { stepProps } = this.props;

		stepProps.onClickPrev();
	}

    onClickButton(id){
        switch (id) {
			case FormButton.PREV:
                return this.onClickPrev();
            case FormButton.CONFIRM:
                return this.onSubmit();
            default:
                break;
        }
    }

    getButtons(){

        return [
			{ id : FormButton.PREV, label : '이전', type : 'ghost' },
            { id : FormButton.CONFIRM, label : "설정완료",  style : { marginLeft: '5px'}},
        ];
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className="propose-step-wrapper step-03">
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="희망 모금기간"
                    >
                        {getFieldDecorator('fundraisingPeriod', {
                            initialValue : 30,
                            rules: [{ required: true, message: '희망 모금기간을 선택하세요' }],
                        })(
                            <RadioGroup>
                                <Radio value={30}>30일</Radio>
                                <Radio value={60}>60일</Radio>
                                <Radio value={90}>90일</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="희망 모금금액"
                    >
                        {getFieldDecorator('goalDonation', {
							rules: [{ required: true, message: '희망 모금금액을 입력하세요' }],
                        })(
                            <InputNumber
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								min={0}
								step={10000}
								style={{width : '100%'}}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								placeholder="희망 모금금액"
							/>
                        )}
                    </FormItem>
                </Form>
                <Row
                    align="middle"
                    className="bank-account"
                >
                    <Col
                        xs={{span: 24}}
                        sm={{span: 6}}
                        className="title"
                    >
                        계좌번호
                    </Col>
                    <Col
                        xs={{span: 24}}
                        sm={{span: 18}}
                    >
                        <AccountContainer form={form} decorator="accountData" root="propose"/>
                    </Col>
                </Row>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="대표 전화번호"
                    >
                        {getFieldDecorator('telno', {
							rules: [{ required: true, message: '대표 전화번호를 입력하세요' }],
                        })(
                            <Input placeholder="-생략" type="number" />
                        )}
                    </FormItem>
                </Form>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(Step03));
