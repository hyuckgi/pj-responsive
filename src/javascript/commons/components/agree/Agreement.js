import React from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';


import { APICaller } from '../../api';
import { values, api, service } from '../../configs';
import { Accordion, List, Checkbox, Button, Badge } from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;

const mapStateToProps = ({fetch}) => {

    return {

    }
};

const mapDispatchToProps = (dispatch) => ({

});

class Agreement extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            list : [],
            terms : {},
        }

        this.onChange = this.onChange.bind(this);
        this.renderExtra = this.renderExtra.bind(this);
        this.onChangeAllTerms = this.onChangeAllTerms.bind(this);
        this.getTerms = this.getTerms.bind(this);
    }

    componentDidMount() {
        this.getTerms();
    }

    getTerms(){
        APICaller.get(api.getTerms(), {})
        .then(({data}) => {
            const { agreementValue } = values;
            const list = service.getValue(data, 'list', []);
            const codes = list.map(item => item.code).reduce((result, item) => {
                result[item] = true;
                return result;
            }, {})

            if(list){
                return this.setState({
                    list,
                    terms : codes
                })
            }
            return;
        })
    }


    onChange(e, item){
        console.log("item", item);

        return this.setState({
            terms : {
                ...this.state.terms,
                [item.code] : e.target.checked
            }
        });
    }

    onChangeAllTerms(e){
        const { form } = this.props;
        const { terms, list } = this.state;
        const codes = list.map(item => item.code).reduce((result, item) => {
            result[item] = true;
            return result;
        }, {});


        if(e.target.checked){
            form.setFieldsValue({
                usedAgreement : true,
                privateAgreement : true,
            })
            return this.setState({
                ...this.state,
                ...codes,
            })
        }else{
            form.setFieldsValue({
                usedAgreement : false,
                privateAgreement : false,
            })
            return this.setState({
                usedAgreement : false,
                privateAgreement : false,
            })
        }
    }

    renderExtra(item){
        return(
            <Button href={item.url} target="_new" size="small" className="custom-btn">보기</Button>
        )
    }

    renderHeader(){
        return(
            <p className="title"><Badge dot>이용약관, 개인정보 수집 및 활용 동의</Badge></p>
        )
    }

    render() {
        const { form } = this.props;
        const { list, terms } = this.state;
        const allTerms = Object.keys(terms).length > 0 && Object.keys(terms).some(item => terms[item] === true);

        return (
            <Accordion defaultActiveKey="0" className="agreement-accordion" >
                <Accordion.Panel header={this.renderHeader()}>
                    <List className="my-list">
                        <CheckboxItem checked={allTerms} key={'allTerms'} onChange={this.onChangeAllTerms} >전체 동의합니다.</CheckboxItem>
                        {list.length && list.map((item, idx) => {
                            return(
                                <List.Item
                                    key={idx}
                                    extra={this.renderExtra(item)}
                                >
                                    <form>
                                        {form.getFieldDecorator(`${item.code}`, {
                                            initialValue : true,
                                        })(<CheckboxItem checked={terms[item.code]} key={item.code} onChange={(e) => this.onChange(e, item)}>{item.terms}</CheckboxItem>)}
                                    </form>
                                </List.Item>
                            )
                        })}
                    </List>
                </Accordion.Panel>
            </Accordion>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Agreement));
