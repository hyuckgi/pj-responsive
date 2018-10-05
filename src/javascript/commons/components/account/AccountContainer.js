import React from 'react';

import {  Radio } from 'antd';

import { MakeAccount } from './';
import { AccountList } from '../';

const RadioGroup = Radio.Group;

class AccountContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isNew : true,
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        e.preventDefault();
        this.setState({
            isNew : e.target.value
        });
    }

    render() {
        const { form, decorator } = this.props;
        const { isNew } = this.state;

        return (
            <div className="account-container">
                <RadioGroup
                    onChange={this.onChange}
                    defaultValue={isNew}
                >
                    <Radio value={true}>새로운 계좌 사용</Radio>
                    <Radio value={false}>자주쓰는 계좌 사용</Radio>
                </RadioGroup>
                {isNew
                ? (<MakeAccount form={form} decorator={decorator}/>)
                : (<AccountList />)
                }
            </div>
        );
    }

}

export default AccountContainer;
