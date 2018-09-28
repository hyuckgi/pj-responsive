import React from 'react';
import PropTypes from 'prop-types';

import { DesktopLayout, MobileLayout } from '../../response';

import { Row, Col } from 'antd';

import { service } from '../../../configs';
import Story from './Story';

class List extends React.Component {

    constructor(props) {
        super(props);

        this.renderCard = this.renderCard.bind(this);
    }

    renderCard(platform){
        const { count, prefixUrl, prefix, data } = this.props;
        const list = service.getValue(data, 'list', []);
        const layout = platform === 'mobile' ? 2 : count;

        if(list.length){
            return list.map((item, inx) => {
                return(
                    <Col
                        span={24 / layout}
                        key={inx}
                    >
                        <Story item={item} prefixUrl={prefixUrl} prefix={prefix}/>
                    </Col>
                );
            });
        }

        return(
            <Col span={24} className="list-none"><p>리스트가 없습니다</p></Col>
        )
    }

    render() {
        return (
            <div className="list-container">
                <DesktopLayout>
                    <Row type="flex" justify="start" gutter={16}>
                        {this.renderCard('web')}
                    </Row>
                </DesktopLayout>
                <MobileLayout>
                    <Row type="flex" justify="start" gutter={10}>
                        {this.renderCard('mobile')}
                    </Row>
                </MobileLayout>
            </div>
        );
    }
}

List.propTypes = {
    data : PropTypes.object,
    count : PropTypes.number,
};

List.defaultProps = {
    data : {},
    count : 4,
};

export default List;
