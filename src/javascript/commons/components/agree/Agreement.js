import React from 'react';
import { createForm } from 'rc-form';

import { APICaller } from '../../api';
import { api, service } from '../../configs';
import { CommonEditor } from '../../components';

import { List, Checkbox, Badge, Toast , Modal} from 'antd-mobile';

const CheckboxItem = Checkbox.CheckboxItem;

class Agreement extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            list : [],
            terms : {},
            visible : false,
            wrap : {
                title : '',
                terms : '',
            }
        }

        this.onChangeAllTerms = this.onChangeAllTerms.bind(this);
        this.getTerms = this.getTerms.bind(this);
        this.onChange = this.onChange.bind(this);

        this.onCloseModal = this.onCloseModal.bind(this);
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
        const key = `terms_${item.code}`;
        return this.setState({
            terms : {
                ...this.state.terms,
                [key] : e.target.checked
            }
        });
    }

    onOpenModal(e, item){
        e && e.preventDefault();
        e && e.stopPropagation();
        this.setState({
            visible : true,
            wrap : item
        });
    }

    onCloseModal(){
        this.setState({
            visible : false,
        })
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
            });
        }else{
            const unChecked = this.getAllTerms(false);
            form.setFieldsValue(unChecked);
            return this.setState({
                terms : unChecked
            });
        }
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
                    arrow="horizontal"
                    extra={(<span onClick={(e) => this.onOpenModal(e, item)}>보기</span>)}
                    onClick={(e) => this.onChange(e, item)}
                >
                    {
                        form.getFieldDecorator(`terms_${item.code}`, {
                            initialValue : true,
                        })(
                            <CheckboxItem
                                checked={terms[`terms_${item.code}`]}
                                key={`terms_${item.code}`}
                            >
                                {item.title}
                            </CheckboxItem>)
                    }
                </List.Item>
            )
        });
    }

    render() {
        const { terms, visible, wrap } = this.state;
        const isMobile = service.isMobile();
        const allTerms = Object.keys(terms).length > 0 && Object.keys(terms).some(item => !terms[item]);

        return (
            <div>
                <List className="agreement-wrapper" renderHeader={this.renderHeader}>
                    <CheckboxItem
                        checked={!allTerms}
                        key={'allTerms'}
                        onChange={this.onChangeAllTerms}
                    >전체 동의합니다.</CheckboxItem>
                    {this.renderTerms()}
                </List>

                <Modal
                    wrapClassName={`modal-agreement ${isMobile ? 'modal-agreement-mobile' : 'modal-agreement-web'}`}
                    visible={visible}
                    transparent={isMobile ? false : true}
                    popup={isMobile ? true : false}
                    animationType={isMobile ? 'slide-up' : 'fade'}
                    maskClosable={true}
                    closable={true}
                    title={wrap.title}
                    onClose={this.onCloseModal}
                    footer={[{text : '확인', onPress : this.onCloseModal}]}
                >
                    <CommonEditor value={wrap.terms} readOnly={true}/>
                </Modal>
            </div>

        );
    }

}

export default createForm()(Agreement);
