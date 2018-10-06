import React from 'react';
import moment from 'moment';

import { APICaller } from '../../../api';
import { api, service, values } from '../../../configs';

import { CustomIcon, ButtonWrapper } from '../../../components';
import { FormButton } from '../../../types';
import { Flex, List } from 'antd-mobile';

class ListItem extends React.Component {

    constructor(props) {
        super(props);

        this.getButtons = this.getButtons.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete(){
        const { item , onEvents } = this.props;
        const accountNo = service.getValue(item, 'accountNo', false);

        if(accountNo){
            return APICaller.delete(api.getAccount(), {accountNo : accountNo})
                .then(({data}) => {
                    const resultCode = service.getValue(data, 'resultCode', false);
                    if(resultCode && resultCode === 200){
                        onEvents({
                            events : 'update'
                        });
                    }
                })
        }
        return;
    }

    onClickButton(id){
        switch (id) {
            case FormButton.DELETE:
                return this.onDelete();
            default:
                break;
        }
    }

    getButtons(){
        return [{ id : FormButton.DELETE, label : null, icon : (<CustomIcon type="FaTrashO" roots="FontAwesome" />), type : 'warning', size : 'small', inline : true}]
    }

    render() {
        const { item } = this.props;
        return (
            <List.Item
                className="account-item"
                extra={(<ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>)}
            >
                <Flex direction="column" align="start" >
                    <Flex.Item className="account-number">
                        계좌번호 : {service.getValue(item, 'accountNumber', '')}
                    </Flex.Item>
                    <Flex.Item>
                        은행명 : {service.getValue(item, 'bankName', '')}
                    </Flex.Item>
                    <Flex.Item>
                        예금주 : {service.getValue(item, 'depositor', '')}
                    </Flex.Item>
                    <Flex.Item>
                        등록일 : {service.getValue(item, 'createDate', false) ? `${moment(item.createDate, values.format.FULL_DATETIME_FORMAT).format(values.format.FULL_DATETIME_FORMAT)}` : ''}
                    </Flex.Item>
                </Flex>
            </List.Item>
        );
    }

}

export default ListItem;
