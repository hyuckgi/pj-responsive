import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { DesktopLayout, MobileLayout } from '../response';

import { Row, Col, Select, Button, Cascader } from 'antd';

import { values, service, path } from '../../configs';

const Option = Select.Option;

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
        this.onChange = this.onChange.bind(this);
    }

    onClick(item, e){
        e.preventDefault();
        const { onChange } = this.props;
        const order = service.getValue(item, 'value', 0);
        this.props.onChange({order : order});
    }

    onChange(...args){
        console.log("onChangeargs", args);
    }

    onSelect(...args){
        console.log("onSelectargs", args);
    }

    renderWebCategory(){
        const { categories } = this.props;

        return(
            <Col span={4}>
                <Cascader
                    defaultValue={[this.props]}
                    options={categories}
                />
            </Col>
        )
    }

    renderWebOrder(){
        const { order } = this.props;
        const options = service.getValue(values, 'story.order');

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

export default connect(mapStateToProps, mapDispatchProps)(ListTop);
