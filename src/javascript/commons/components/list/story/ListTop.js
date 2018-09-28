import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import queryString from 'query-string';

import { Flex, Button } from 'antd-mobile';

import { values, service, path } from '../../../configs';
import { CustomPicker } from '../../';

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

        this.renderOrder = this.renderOrder.bind(this);
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
        let queryValue = value.reduce((result, item) => {
            result = result.concat(`${item}/`);
            return result;
        }, '');

        if(type){
            return this.props.move(`${path.moveCate(prefixUrl, type, queryValue.slice(0, -1))}`)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.type !== this.props.match.params.type){
            this.renderCategory();
        }
    }

    renderCategory(){
        const { categories, location } = this.props;
        const query = queryString.parse(location.search);
        const categoryNo = service.getValue(query, 'category', false);
        const defaultValue = categoryNo ? [categoryNo.split('/').map(item => Number(item))] : [];

        return(
            <Flex.Item>
                <CustomPicker
                    value={defaultValue}
                    options={categories}
                    onChange={this.onChange}
                    placeholder="카테고리를 선택하세요"
                />
            </Flex.Item>
        )
    }

    renderOrder(){
        const { order, match } = this.props;
        const options = service.getValue(values, 'story.order');
        const { type } = match.params;

        if(type !== 'progress'){
            return;
        }

        return(
            <Flex.Item style={{textAlign : 'right'}}>
                {options.map((item, inx) => {
                    return (
                        <Button
                            key={inx}
                            inline
                            size="small"
                            onClick={this.onClick.bind(this, item)}
                            type={order === item.value ? 'primary' : 'ghost'}
                            style={{marginRight : 5, marginLeft: 5}}
                        >
                            {item.label}
                        </Button>
                    );
                })}
            </Flex.Item>
        )
    }

    render() {
        return (
            <Flex justify="between" className="list-top-wrapper">
                {this.renderCategory()}
                {this.renderOrder()}
            </Flex>
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
