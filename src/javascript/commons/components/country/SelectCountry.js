import React  from 'react';
import { createForm } from 'rc-form';
import UAParser from 'ua-parser-js';

import { APICaller } from '../../api';
import { api, service } from '../../configs';

import { DesktopLayout, MobileLayout } from '../response';

import { Select, Radio } from 'antd';

import { Toast, Picker, List } from 'antd-mobile';


const Option = Select.Option;
const initialValue = window.navigator.language.split("-")[1];

const parser = new UAParser();

class SelectCountry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            countries : [],
            newList : [],
            selected : {},
            onSearch : false,
        };

        this.getCountry = this.getCountry.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getFilter = this.getFilter.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onOK = this.onOK.bind(this);
    }

    componentDidMount() {
        this.getCountry();
    }

    getCountry(){
        return APICaller.get(api.getCountry(), {})
            .then(({data}) => {
                const list = service.getValue(data, 'list', [])
                const countries = list.map(item => {
                    item['value'] = item.code;
                    item['label'] = item.name;
                    return item;
                });

                if(list){
                    return this.setState({
                        countries
                    });
                }
            })
            .catch(e => {
                return Toast.fail('잠시 후에 다시 시도하세요.', 1);
            });
    }

    filterOption(...args){
        console.log("args", args);
    }

    onSearch(value){
        if(value.length < 3){
            this.setState({
                onSearch : false,
                newList : []
            });
            return;
        }
        const newList = this.getFilter(value, 'name');

        if(newList.length){
            this.setState({
                onSearch : true,
                newList : newList
            });
        }else{
            this.setState({
                onSearch : false,
                newList : []
            });
        }
    }

    getFilter(value, flag='code'){
        const { countries } = this.state;

        if(flag === 'name'){
            return countries.filter(item => (item.name.toUpperCase()).indexOf(value.toUpperCase()) !== -1)
        }

        return countries.filter(item => item.code === value).reduce((result, item) => {
            item['key'] = item.key || item.code;
            result = {...item};
            return result;
        }, {});
    }

    onSelect(value, option){
        const { form } = this.props;

        this.setState({
            onSearch : false,
            newList : []
        });

        form.setFieldsValue({country : service.getValue(option, 'props.data-item', {})});
    }

    onChange(value){
        console.log("val");
    }

    getMList(list){
        return list.map(item => item.name.slice(0, 1))
            .sort()
            .reduce((result, item) => {
                if(result.slice(-1)[0] !== item){
                    result.push(item);
                }
                return result;
            }, [])
            .reduce((result, item) => {
                const test2 = list.filter(c => c.name.slice(0, 1) === item);
                if(test2){
                    let obj = {value : item, label : item, children : test2};
                    result.push(obj);
                }
                return result;
            }, []);
    }

    onOK(values){
        const { form } = this.props;
        const item = this.getFilter(values[1]);
        this.setState({
            selected : item,
        })
        form.setFieldsValue({country : item});
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldProps } = form;
        const { countries, onSearch, newList, selected } = this.state;

        const initial = countries.length && this.getFilter(initialValue);
        const isMobile = parser.getDevice().type;
        const list = onSearch ? newList : countries;
        const mList = isMobile ? this.getMList(countries) : [];

        return (
            <div className="select-country">
                <DesktopLayout>
                    {getFieldDecorator('selectCountry', {
                        initialValue : `${initial.name} / ${initial.code}`
                    })(
                        <Select
                            mode="combobox"
                            placeholder="Select or Input Your Country"
                            filterOption={false}
                            onSearch={this.onSearch}
                            onChange={this.onChange}
                            onSelect={this.onSelect}
                            style={{ width: '100%' }}
                        >
                            {list.map(item => (<Option key={item.code} value={`${item.name} / ${item.code}`} data-item={item}>{item.label}</Option> ))}
                        </Select>
                    )}
                    <Radio
                        {...getFieldProps('country', {
                            initialValue : initial,
                        })}
                        style={{display: 'none'}}
                    />
                </DesktopLayout>
                <MobileLayout>
                    <List>
                        <Picker
                            {...getFieldProps('country', {
                            })}
                            data={mList}
                            cols={2}
                            title="국가선택"
                            okText="완료"
                            dismissText="취소"
                            onOk={this.onOK}
                            extra={service.getValue(selected, 'code', false) ? (`${service.getValue(selected, 'name')} / ${service.getValue(selected, 'code')}`) : '선택'}
                        >
                            <List.Item arrow="horizontal">Select Your Country</List.Item>
                        </Picker>
                    </List>
                </MobileLayout>
            </div>
        );
    }

}

export default createForm()(SelectCountry);
