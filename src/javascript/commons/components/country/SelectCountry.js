import React  from 'react';
import { createForm } from 'rc-form';

import { APICaller } from '../../api';
import { api, service } from '../../configs';

import { DesktopLayout, MobileLayout } from '../response';
import { Select } from 'antd';
import { Toast, Picker, List } from 'antd-mobile';

const Option = Select.Option;
const initialValue = window.navigator.language.split("-")[1];

class SelectCountry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            countries : [],
            newList : [],
            selected : {},
        };

        this.getCountry = this.getCountry.bind(this);
        this.getFilter = this.getFilter.bind(this);
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
                    item['webLabel'] = `${item.name} / ${item.code}`;
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
        const item = this.getFilter(values[1]);
        return this.setState({
            selected : item,
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldProps } = form;
        const { countries, onSearch, newList } = this.state;

        const initial = countries.length && this.getFilter(initialValue);
        const list = onSearch ? newList : countries;
        const mList = service.isMobile() ? this.getMList(countries) : [];

        return (
            <div className="select-country">
                <DesktopLayout>
                    {getFieldDecorator('countryCode', {
                        initialValue : initial.value
                    })(
                        <Select
                            placeholder="Select or Input Your Country"
                            filterOption={false}
                            onSelect={this.onSelect}
                            style={{ width: '100%' }}
                        >
                            {list.map(item => (<Option key={item.code} value={item.value} >{item.webLabel}</Option> ))}
                        </Select>
                    )}
                </DesktopLayout>
                <MobileLayout>
                    <List>
                        <Picker
                            {...getFieldProps('countryMobileCode', {
                            })}
                            data={mList}
                            cols={2}
                            title="국가선택"
                            okText="완료"
                            dismissText="취소"
                            onOk={(v) => this.onOK(v)}
                            extra={'선택'}
                            format={(labels) => {return labels[1]}}
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
