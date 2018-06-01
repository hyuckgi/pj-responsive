import React from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';

import { ButtonWrapper, CustomPicker } from '../../commons/components';
import { service } from '../../commons/configs';
import { FormButton } from '../../commons/types';

import { Toast, List, InputItem, WhiteSpace } from 'antd-mobile';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


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


    onClickNext(){

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
            { id : FormButton.NEXT, label : '다음' }
        ];
    }

    render() {
        const { form, categories } = this.props;
        const { getFieldProps, getFieldError } = form;

        return (
            <div className="propose-step-wrapper step-01">
                <List full="true">
                    <WhiteSpace size="md"/>
                    <CustomPicker options={categories} />
                    <WhiteSpace size="md"/>
                </List>

                <WhiteSpace size="lg"/>

                <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(createForm()(Step01));
