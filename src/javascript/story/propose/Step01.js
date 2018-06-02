import React from 'react';
import { connect } from 'react-redux';

import { ButtonWrapper } from '../../commons/components';
import { service } from '../../commons/configs';
import { FormButton } from '../../commons/types';

import { Form, Cascader, Select, Checkbox, Input} from 'antd';

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

class Step01 extends React.Component {

    constructor(props) {
        super(props);


        this.onChange = this.onChange.bind(this);
    }

    onClickNext(){
        const { stepProps } = this.props;

        stepProps.onClickNext();
    }

    onClickButton(id){
        switch (id) {
            case FormButton.NEXT:
                return this.onClickNext();
            default:
                break;
        }
    }

    onChange(...args){
        console.log("args", args);
    }

    getButtons(){
        return [
            { id : FormButton.NEXT, label : "다음" }
        ];
    }

    render() {
        const { form, categories } = this.props;
        const { getFieldDecorator, getFieldError } = form;

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
                        {getFieldDecorator('hash', {
                        })(
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                onChange={this.onChange}
                                tokenSeparators={[',']}
                                dropdownStyle={{display:'none'}}
                            >
                                <Option key='1'>{1}</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{xs:{span: 24, offset: 0}, sm : {span : 20, offset : 4}}}
                    >
                        {getFieldDecorator('agree', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(
                            <Checkbox>스토리 등록 기준 동의</Checkbox>
                        )}
                    </FormItem>
                    <FormItem
                        wrapperCol={{xs:{span: 24, offset: 0}, sm : {span : 20, offset : 4}}}
                    >
                        <TextArea
                            autosize={false}
                            rows={4}
                            disabled
                            defaultValue={'dwewadasfsdfsdfsdgkmbmdbldflvs,dl'}
                        />
                    </FormItem>
                </Form>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(Step01));
