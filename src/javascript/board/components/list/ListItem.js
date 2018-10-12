import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Flex } from 'antd-mobile';

import { service, values } from '../../../commons/configs';

import { BlankImage } from '../../../commons/components';

const mapStateToProps = ({fetch}) => {
    return {
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class ListItem extends React.Component {
    constructor(props) {
        super(props);


        this.renderItem = this.renderItem.bind(this);
        this.renderEvent = this.renderEvent.bind(this);
        this.renderNotice = this.renderNotice.bind(this);
    }

    renderEvent(item){
        const { type } = this.props;
        const src = service.getValue(item, 'thumbnailUrl', false);
        const startDate = service.getValue(item, 'startDate', false);
        const endDate = service.getValue(item, 'endDate', false);

        return (
            <Flex className={`board-list-item ${type}-item`}>
                <Flex.Item className="thumbnail">
                    {src ? <img src={src} alt={item.title}/> : <BlankImage /> }
                </Flex.Item>
                <Flex.Item className="contents">
                    <h3>{item.title}</h3>
                    <p className="date">{moment(startDate, values.format.FULL_DATETIME_FORMAT).format(values.format.DATE_FORMAT)} {endDate ? ` ~${moment(endDate, values.format.FULL_DATETIME_FORMAT).format(values.format.DATE_FORMAT)}` : ''}</p>
                </Flex.Item>
            </Flex>
        )
    }

    renderNotice(item){
        const { type } = this.props;

        return (
            <Flex className={`board-list-item ${type}-item`}>
                <Flex.Item>
                    {service.getValue(item, 'title', '')}
                </Flex.Item>
                <Flex.Item>
                    {service.getValue(item, 'contents', '')}
                </Flex.Item>
            </Flex>
        )
    }

    renderItem(){
        const { type, item } = this.props;
        if(!Object.keys(item).length){
            return;
        }

        if(type === 'event'){
            return this.renderEvent(item);
        }
        return this.renderNotice(item);
    }

    render() {
        return this.renderItem();
    }

}

export default connect(mapStateToProps, mapDispatchProps)(ListItem);
