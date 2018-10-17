import React from 'react';
import PropTypes from 'prop-types';

import { DesktopLayout, MobileLayout } from '../response';
import { service } from '../../configs';

import { Cascader } from 'antd';
import { Picker, List } from 'antd-mobile';

class CustomPicker extends React.Component {

    onChange(value){
        const { onChange } = this.props;

        if(onChange){
            onChange(value);
        }
    }

    convertOptions(options){
        return service.mappingKey(options);
    }


    render() {
        const { options, value, type, label = null } = this.props;

        return (
            <div className="custom-picker">
                <DesktopLayout>
                    <Cascader
                        {...this.props}
                        options={this.convertOptions(options)}
                        onChange={this.onChange.bind(this)}
                    />
                </DesktopLayout>
                <MobileLayout>
                    <List className="picker-list-container">
                        <Picker
                            value={value[0]}
                            data={options}
                            title={type}
                            okText="완료"
                            dismissText="취소"
                            onOk={this.onChange.bind(this)}
                            extra={`${type} 선택`}
                            format={(labels) => {
                                return labels[labels.length - 1];
                            }}
                        >
                            <List.Item>{label}</List.Item>
                        </Picker>
                    </List>
                </MobileLayout>
            </div>
        );
    }

}

CustomPicker.propTypes = {
    options : PropTypes.array.isRequired,
};

CustomPicker.defaultProps = {
    options : [],
    key : 'category'
};

export default CustomPicker;
