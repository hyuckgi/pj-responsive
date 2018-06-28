import React from 'react';


import { service, values } from '../commons/configs';
import { Flex } from 'antd-mobile';

class RankTop extends React.Component {


    renderItem(){
        const list = service.getValue(this.props, 'item.rankerList', [])

        return list.map((item, inx) => {
            const typeObj = values.rank.types.filter(type => type.type === item.type).find(item => item);

            // TODO: 실제 섬네일 이미지 사용
            // const thumnail = service.getValue(item, 'thumbnailUrl', false);
            const thumnail = 'https://picsum.photos/150/150?random';

            return (
                <Flex.Item key={inx}>
                    <p className="title">{service.getValue(typeObj, 'title', '')}</p>
                    {thumnail ?
                        <div className="thumnail">
                            <img src={thumnail} alt={item.userId} />
                        </div>
                        : null}
                    <p className="user-id">{service.getMasking(service.getValue(item, 'userId', ''), 3)}</p>
                    <p className="count">참여 {service.getValue(item, 'donateCount', 0)}회</p>
                    <p className="price">기부 {service.amount(service.getValue(item, 'totalDonation', 0))}원</p>
                </Flex.Item>
            )
        })
    }

    render() {
        const { item } = this.props;

        return (
            <div className="rank-top">
                <Flex className="rank-top-total">
                    <Flex.Item>전체 기부금</Flex.Item>
                    <Flex.Item>{service.amount(service.getValue(item, 'totalDonation', 0))}원</Flex.Item>
                </Flex>
                <Flex className="rank-top-list" justify="center">
                    {this.renderItem()}
                </Flex>
            </div>
        );
    }

}

export default RankTop;
