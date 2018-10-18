import React from 'react';
import moment from 'moment';

import { APICaller } from '../../../api';
import { api, service, values } from '../../../configs';

import { CustomIcon, ButtonWrapper } from '../../../components';
import { FormButton } from '../../../types';
import { Flex, List, Modal, Toast } from 'antd-mobile';

const alert = Modal.alert;

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
        const obj = api.account({accountNo : accountNo});

        return APICaller.delete(obj.url, obj.params)
            .then(({data}) => {
                const resultCode = service.getValue(data, 'resultCode', false);
                const resultMsg = service.getValue(data, 'resultMsg', '');
                if(resultCode === 200){
                    return onEvents({
                        events : 'update'
                    });
                }
                return Toast.fail(resultMsg, 2);

            });
    }

    onClickButton(id){
        switch (id) {
            case FormButton.DELETE:
                return alert('계좌 삭제', '정말로 계좌를 삭제하시겠습니까?', [
                    { text: 'Cancel', onPress: () => console.log('cancel') },
                    { text: 'Ok', onPress: () => this.onDelete() },
                ]);
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
                        일련번호 : {service.getValue(item, 'accountNo', '')}
                    </Flex.Item>
                    <Flex.Item>
                        은행명 : {service.getValue(item, 'bankName', '')}
                    </Flex.Item>
                    <Flex.Item>
                        예금주 : {service.getValue(item, 'accountName', '')}
                    </Flex.Item>
                </Flex>
            </List.Item>
        );
    }

}

export default ListItem;
