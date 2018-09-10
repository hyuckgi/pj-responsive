import React from 'react';

import { service } from '../../../commons/configs';

import { Flex } from 'antd-mobile';
import { Avatar } from 'antd';

class ItemTop extends React.Component {

    render() {
        const { item } = this.props;
        const thumnail = service.getValue(item, 'profileUrl', false);
        const nickname = service.getValue(item, 'nickname', false);

        return (
            <div className="rank-top">
                <Flex className="rank-top-list" justify="center">
                    <Flex.Item>
                        {thumnail
                            ?
                            <div className="thumnail" >
                                <img src={thumnail} alt={item.username} />
                            </div>
                            :
                            <Avatar icon="user" size="large" />
                        }
                    </Flex.Item>

                    <Flex.Item>
                        <p className="user-id">{service.getMasking(service.getValue(item, 'username', ''), 3)} {`${nickname ? `(${nickname})` : ''}`}</p>
                        <p className="count">참여 : {service.getValue(item, 'donateCount', 0)}회</p>
                        <p className="price">기부 : {service.amount(service.getValue(item, 'totalDonation', 0))}원</p>
                    </Flex.Item>
                </Flex>
            </div>
        );
    }

}

export default ItemTop;
