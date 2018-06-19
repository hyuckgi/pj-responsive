import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
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
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onClick(item, e){
        e.preventDefault();
        const { onChange } = this.props;
        const order = service.getValue(item, 'value', 0);
        this.props.onChange({order : order});
    }

    onChange(value){
        const { basePath, match } = this.props;
        const type = service.getValue(match, 'params.type', false);

        if(type){
            return this.props.move(`${path.moveList(basePath, type, value.slice(-1).find(item => item))}`)
        }
    }

    renderWebCategory(){
        const { categories, match } = this.props;
        const categoryNo = service.getValue(match, 'params.categoryNo', "0");

        return(
            <Col span={6}>
                <Cascader
                    defaultValue={[parseInt(categoryNo, 10)]}
                    options={categories}
                    onChange={this.onChange}
                    placeholder="카테고리를 선택하세요"
                    style={{width : '100%'}}
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ListTop));
