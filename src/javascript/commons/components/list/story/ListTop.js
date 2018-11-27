import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import queryString from 'query-string';

import { Flex, Button, List, Picker } from 'antd-mobile';

import { values, service, path } from '../../../configs';
import { CustomPicker, DesktopLayout, MobileLayout } from '../../';

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
        this.onOk = this.onOk.bind(this);
    }

    onClick(item, e){
        e.preventDefault();
        const order = service.getValue(item, 'value', 0);
        this.props.onChange({order : order});
    }

    onOk(values){
        this.props.onChange({order : values[0]});
    }

    onChange(value){
        const { prefixUrl, match } = this.props;
        const type = service.getValue(match, 'params.type', false);

        if(type){
            return this.props.move(`${path.moveParams(prefixUrl, type, {category : value.join('/')})}`)
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
                    type="카테고리"
                />
            </Flex.Item>
        )
    }

    renderOrder(){
        const { order, match } = this.props;
        const options = service.getValue(values, 'story.order');
        const current = options.filter(item => item.value === order).find(item => item);

        const { type } = match.params;

        if(type !== 'progress'){
            return;
        }

        return(
            <Flex.Item style={{textAlign : 'right'}}>
                <DesktopLayout>
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
                </DesktopLayout>
                <MobileLayout>
                    <List className="picker-list-container">
                        <Picker
                            value={[current.value]}
                            data={options}
                            title="정렬"
                            cols={1}
                            okText="완료"
                            dismissText="취소"
                            onOk={this.onOk}
                            extra={`${current.label}`}
                            format={(labels) => {
                                return labels;
                            }}
                        >
                            <List.Item></List.Item>
                        </Picker>
                    </List>
                </MobileLayout>
            </Flex.Item>
        )
    }

    render() {
        return (
            <Flex justify="between" className="list-top-wrapper">
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
