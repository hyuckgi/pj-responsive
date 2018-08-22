import React from 'react';
import { connect } from 'react-redux';

import { ButtonWrapper } from '../../../commons/components';
import { service } from '../../../commons/configs';
import { FormButton } from '../../../commons/types';

import { Form, Cascader, Select, Checkbox, Input, Modal} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

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
    const categories = service.getValue(code, 'categories', [])

    return {
        categories
    }
};

const mapDispatchProps = dispatch => ({
    multipleList: (list) => dispatch(fetch.multipleList(list)),
});

class Step01 extends React.Component {

    constructor(props) {
        super(props);

		this.errorToast = this.errorToast.bind(this);
		this.makeModal = this.makeModal.bind(this);
		this.onModalOk = this.onModalOk.bind(this);
    }

	makeModal(messages){
        return Modal.error({
			title : '오류가 발생했습니다.',
			content : (<div>
                {messages.map((message, idx) => {
                    return (<p key={idx}>{message}</p>)
                })}
            </div>),
			onOk : this.onModalOk,
		});
    }

	onModalOk(){
		console.log("aaaaa");
	}

	errorToast(errors = null){
		const { getFieldError } = this.props.form;
        if(!errors){
            return;
        }

        const messages = Object.keys(errors)
            .map(item => {
                return getFieldError(item);
            })
            .reduce((result, item, idx) => {
                return result.concat(item);
            }, []);

        return this.makeModal(messages);
	}

    onClickNext(){
        const { stepProps, form } = this.props;

		form.validateFields((errors, value) => {

			if(!value.isRegAgree){
				return Modal.warning({
					title: '스토리 등록 기준 동의',
					content: '스토리 등록 기준에 동의해주세요.',
				});
			}

			if(!errors){
                const newValue = {
                    ...value,
                    categoryNo : value.category.slice(-1).find((item) => item),
                };
                delete newValue['category'];
                return stepProps.onClickNext(newValue);
			}

			return this.errorToast(errors);
		});
    }

    onClickButton(id){
        switch (id) {
            case FormButton.NEXT:
                return this.onClickNext();
            default:
                break;
        }
    }

    getButtons(){
        return [
            { id : FormButton.NEXT, label : "다음"}
        ];
    }

    render() {
        const { form, categories } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className="propose-step-wrapper step-01">
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="카테고리"
                    >
                        {getFieldDecorator('category', {
                            rules: [{ type: 'array', required: true, message: '카테고리를 선택하세요' }],
                        })(
                            <Cascader
                                options={categories}
                                placeholder="카테고리 선택"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="해시태그"
                    >
                        {getFieldDecorator('hashTags', {
                        })(
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                tokenSeparators={[',']}
                                dropdownStyle={{display:'none'}}
                            >
                                <Option key='1'>{1}</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        className="reg-agree-checkbox"
                        wrapperCol={{xs:{span: 24, offset: 0}, sm : {span : 20, offset : 4}}}
                    >
                        {getFieldDecorator('isRegAgree', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>스토리 등록 기준 동의</Checkbox>
                        )}
                    </FormItem>
                    <FormItem
                        className="text-area-box"
                        wrapperCol={{xs:{span: 24, offset: 0}, sm : {span : 20, offset : 4}}}
                    >
                        <TextArea
                            autosize={false}
                            rows={4}
                            disabled
                            defaultValue={`① 모금함을 중도에 중단하거나 탈퇴하시는 경우,
    해당 시점까지 모인 모금액은 기부되지 않음에 동의합니다.

② 최대 모금 가능금액은 1,000만원 미만이며,
    최대 금액 달성 시 모금이 마감되는 조건에 동의합니다.`}
                        />
                    </FormItem>
                </Form>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(Step01));
