import React from 'react';
import { connect } from 'react-redux';

import { ButtonWrapper } from '../../commons/components';
import { service } from '../../commons/configs';
import { FormButton } from '../../commons/types';

import { Form, Cascader, Select, Checkbox, Input, Radio} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;


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
	}
};


const mapStateToProps = ({fetch, code}) => {
    const categories = service.getValue(code, 'categories', [])

    return {
        categories
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Step03 extends React.Component {

    constructor(props) {
        super(props);


        this.onChange = this.onChange.bind(this);
    }

    onSubmit(){
        const { stepProps } = this.props;

        stepProps.onSubmit();
    }

    onClickButton(id){
        switch (id) {
            case FormButton.CONFIRM:
                return this.onSubmit();
            default:
                break;
        }
    }

    onChange(...args){
        console.log("args", args);
    }

    getButtons(){
        return [
            { id : FormButton.CONFIRM, label : "설정완료"},
        ];
    }

    render() {
        const { form, categories } = this.props;
        const { getFieldDecorator, getFieldError } = form;

        return (
            <div className="propose-step-wrapper step-02">
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="희망 모금기간"
                    >
                        {getFieldDecorator('period', {
                            initialValue : "a",
                            rules: [{ required: true, message: '제목을 입력하세요' }],
                        })(
                            <RadioGroup>
                                <Radio value="a">30일</Radio>
                                <Radio value="b">60일</Radio>
                                <Radio value="c">90일</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="희망 모금금액"
                    >
                        {getFieldDecorator('price', {
                        })(
                            <Input type="number" placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="계좌번호"
                    >
                        {getFieldDecorator('account', {
                        })(
                            <Input placeholder="첫 문장이 가장 중요!" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="대표 전화번호"
                    >
                        {getFieldDecorator('phone', {
                        })(
                            <Input placeholder="첫 문장이 가장 중요!" />
                        )}
                    </FormItem>
                </Form>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(Step03));
