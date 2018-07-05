import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { service, values, path } from '../../../commons/configs';
import { Flex } from 'antd-mobile';
import { Avatar } from 'antd';


const mapStateToProps = ({fetch}) => {
    return {
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class ListTop extends React.Component {

    onClick(item, e){
        e.preventDefault();
        const userNo = service.getValue(item, 'userNo', false);
        const { type } = this.props;

        if(userNo){
            return this.props.move(path.moveItem(path.rankItem, userNo, type));
        }
    }

    renderItem(){
        const list = service.getValue(this.props, 'item.rankerList', []);
        const { type } =  this.props;
        const countTitle = type === 'user' ? '참여' : '참여스토리';
        const count = type === 'user' ? 'donateCount' : 'sponsorCount';

        return list.map((item, inx) => {
            const typeObj = values.rank[type].types.filter(type => type.type === item.type).find(item => item);
            const thumnail = service.getValue(item, 'profileUrl', false);

            return (
                <Flex.Item key={inx}>
                    <p className="title">{service.getValue(typeObj, 'title', '')}</p>
                    {thumnail
                        ?
                        <div className="thumnail" onClick={this.onClick.bind(this, item)}>
                            <img src={thumnail} alt={item.userId} />
                        </div>
                        :
                        <Avatar icon="user" size="large" onClick={this.onClick.bind(this, item)}/>
                    }
                    <p className="user-id" onClick={this.onClick.bind(this, item)}>{service.getMasking(service.getValue(item, 'userId', ''), 3)}</p>
                    <p className="count">{countTitle} {service.getValue(item, `${count}`, 0)}회</p>
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
                    <Flex.Item>{service.amount(service.getValue(item, 'totalDonation', 0))}원 기부</Flex.Item>
                </Flex>
                <Flex className="rank-top-list" justify="center">
                    {this.renderItem()}
                </Flex>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(ListTop);
