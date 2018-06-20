import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import queryString from 'query-string';

import { DesktopLayout, MobileLayout } from '../response';

import { Row, Col, Button, Cascader } from 'antd';
import { WhiteSpace } from 'antd-mobile';

import { values, service, path } from '../../configs';

const mapStateToProps = ({code, fetch}) => {
    const categories = service.getValue(code, 'categories', []);
    return {
        categories
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
});

class ListTop extends React.Component {

    constructor(props) {
        super(props);

        this.renderWebOrder = this.renderWebOrder.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onClick(item, e){
        e.preventDefault();
        const order = service.getValue(item, 'value', 0);
        this.props.onChange({order : order});
    }

    onChange(value){
        const { prefixUrl, match } = this.props;
        const type = service.getValue(match, 'params.type', false);

        if(type){
            return this.props.move(`${path.moveCate(prefixUrl, type, value.slice(-1).find(item => item))}`)
        }
    }

    renderWebCategory(){
        const { categories, location } = this.props;
        const query = queryString.parse(location.search);
        const categoryNo = service.getValue(query, 'category', false);
        const defaultValue = categoryNo ? [parseInt(categoryNo, 10)] : [];

        return(
            <Col span={6}>
                <Cascader
                    defaultValue={defaultValue}
                    value={defaultValue ? defaultValue : null}
                    options={categories}
                    onChange={this.onChange}
                    placeholder="카테고리를 선택하세요"
                    style={{width : '100%'}}
                />
            </Col>
        )
    }

    renderWebOrder(){
        const { order, match } = this.props;
        const options = service.getValue(values, 'story.order');
        const { type } = match.params;

        if(type !== 'progress'){
            return;
        }

        return(
            <Col span={5}>
                <Row  type="flex" align="middle" justify="space-between">
                    {options.map((item, inx) => {
                        return (
                            <Col
                                key={inx}
                                span={24/options.length}
                            >
                                <Button
                                    onClick={this.onClick.bind(this, item)}
                                    type={order === item.value ? 'primary' : null}
                                >
                                    {item.label}
                                </Button>
                            </Col>
                        );
                    })}
                </Row>
            </Col>
        )
    }

    render() {
        return (
            <div className="list-top-wrapper">
                <DesktopLayout>
                    <Row  type="flex" align="middle" justify="space-between">
                        {this.renderWebCategory()}
                        {this.renderWebOrder()}
                    </Row>
                    <WhiteSpace />
                </DesktopLayout>
            </div>
        );
    }

}

ListTop.propTypes = {
    order : PropTypes.number,
};

ListTop.defaultProps = {
    order : 0,
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ListTop));
