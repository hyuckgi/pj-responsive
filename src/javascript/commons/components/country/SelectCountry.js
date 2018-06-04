import React  from 'react';
import { createForm } from 'rc-form';


import { APICaller } from '../../api';
import { api, values, service } from '../../configs';

import { DesktopLayout, MobileLayout } from '../response';

import { Select, Spin } from 'antd';

import { Toast } from 'antd-mobile';


const Option = Select.Option;
const initialValue = window.navigator.language.split("-")[1];

class SelectCountry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            countries : [],
            fetching : false,
            item : {},
            newList : [],
            onSearch : false,
        };

        this.getCountry = this.getCountry.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getFilter = this.getFilter.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSelect = this.onSelect.bind(this);
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
        console.log("onSearch", value);
        if(value.length < 3){
            this.setState({
                onSearch : false,
                newList : []
            });
            return;
        }

        this.setState({fetching : true});
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
            item['key'] = item.code;
            result = {...item};
            return result;
        }, {});
    }

    onSelect(value, option){
        this.setState({
            onSearch : false,
            newList : []
        });
    }

    onChange(value){
        const { form } = this.props;
        const item = this.getFilter(value)

        this.setState({
            fetching : false,
        });

        form.setFieldsValue({country : item});
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { countries, fetching, onSearch, newList } = this.state;
        const initial = this.getFilter(initialValue);
        const list = onSearch ? newList : countries;

        return (
            <div className="select-country">
                <DesktopLayout>
                    {getFieldDecorator('country', {
                        initialValue : `${initial.name} (${initial.code})`
                    })(
                        <Select
                            mode="combobox"
                            placeholder="Select or Input Your Country"
                            notFoundContent={fetching ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={this.onSearch}
                            onChange={this.onChange}
                            onSelect={this.onSelect}
                            style={{ width: '100%' }}
                        >
                            {list.map(item => (<Option key={item.code} value={`${item.name} (${item.code})`}>{item.name}</Option> ))}
                        </Select>
                    )}
                </DesktopLayout>
                <MobileLayout>
                    MobileLayout
                </MobileLayout>
            </div>
        );
    }

}

export default createForm()(SelectCountry);
