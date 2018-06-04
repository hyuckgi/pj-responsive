import React from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';

import { APICaller } from '../../api';
import { api, service } from '../../configs';

import { Accordion, List, Checkbox, Button, Badge, Toast } from 'antd-mobile';

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
        return APICaller.get(api.getTerms(), {})
            .then(({data}) => {
                const list = service.getValue(data, 'list', []);
                const codes = list.map(item => item.code).reduce((result, item) => {
                    const key = `terms_${item}`;
                    result[key] = true;
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
            .catch(e => {
                return Toast.fail('잠시 후에 다시 시도하세요.', 1);
            });
    }

    onChange(e, item){
        e.preventDefault();
        e.stopPropagation();
        const key = `terms_${item.code}`;
        return this.setState({
            terms : {
                ...this.state.terms,
                [key] : e.target.checked
            }
        });
    }

    getAllTerms(value){
        const { terms } = this.state;

        return Object.keys(terms).reduce((result, item) => {
            result[item] = value;
            return result;
        }, {});
    }

    onChangeAllTerms(e){
        const { form } = this.props;

        if(e.target.checked){
            const checked = this.getAllTerms(true);
            form.setFieldsValue(checked);
            return this.setState({
                terms : checked
            })
        }else{
            const unChecked = this.getAllTerms(false);
            form.setFieldsValue(unChecked);
            return this.setState({
                terms : unChecked
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

    renderTerms(){
        const { list, terms } = this.state;
        const { form } = this.props;

        if(!list.length){
            return;
        }

        return list.map((item, idx) => {
            return (
                <List.Item
                    key={idx}
                >
                    <Accordion>
                        <Accordion.Panel header={
                            form.getFieldDecorator(`terms_${item.code}`, {
                                initialValue : true,
                            })(<CheckboxItem checked={terms[`terms_${item.code}`]} key={`terms_${item.code}`} onChange={(e) => this.onChange(e, item)}>{item.title}</CheckboxItem>)
                        }>
                            <div>{item.terms}</div>
                        </Accordion.Panel>
                    </Accordion>
                </List.Item>
            )
        });
    }

    render() {
        const { terms } = this.state;
        const allTerms = Object.keys(terms).length > 0 && Object.keys(terms).some(item => !terms[item]);

        return (
            <List className="agreement-wrapper" renderHeader={this.renderHeader}>
                <CheckboxItem
                    checked={!allTerms}
                    key={'allTerms'}
                    onChange={this.onChangeAllTerms}
                >전체 동의합니다.</CheckboxItem>
                {this.renderTerms()}
            </List>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(createForm()(Agreement));
