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

class Step02 extends React.Component {

    constructor(props) {
        super(props);


        this.onChange = this.onChange.bind(this);
    }

    onClickNext(){
        const { stepProps } = this.props;

        stepProps.onClickNext();
    }

    onClickPrev(){
        const { stepProps } = this.props;

        stepProps.onClickPrev();
    }

    onClickButton(id){
        switch (id) {
            case FormButton.PREV:
                return this.onClickPrev();
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
            { id : FormButton.PREV, label : "이전" },
            { id : FormButton.NEXT, label : "다음", style : { marginLeft: '5px'}},
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
                        label="스토리 제목"
                    >
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '제목을 입력하세요' }],
                        })(
                            <Input placeholder="스토리 제목" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="소제목"
                    >
                        {getFieldDecorator('sub-title', {
                        })(
                            <Input placeholder="첫 문장이 가장 중요!" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="본문"
                    >
                        <TextArea
                            rows={4}
                            defaultValue={'본문'}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="관련사진"
                    >
                        {getFieldDecorator('pic', {
                        })(
                            <Input placeholder="첫 문장이 가장 중요!" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="동영상"
                    >
                        {getFieldDecorator('mov', {
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

export default connect(mapStateToProps, mapDispatchProps)(Form.create()(Step02));
