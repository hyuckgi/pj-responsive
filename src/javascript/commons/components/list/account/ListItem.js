import React from 'react';

import { APICaller } from '../../../api';
import { api, service } from '../../../configs';

import { FormButton } from '../../../types';

import { Flex, Button, List, Modal } from 'antd-mobile';



class ListItem extends React.Component {


    render() {
        const { item } = this.props;

        return (
            <List.Item
                className="account"
            >
                {service.getValue(item, 'bankName', '은행명')}
            </List.Item>
        );
    }

}

export default ListItem;
