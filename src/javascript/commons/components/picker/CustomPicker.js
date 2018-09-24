import React from 'react';
import PropTypes from 'prop-types';

import { DesktopLayout, MobileLayout } from '../response';
import { service } from '../../configs';

import { Cascader } from 'antd';

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
        const { options } = this.props;

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
                    MobileLayout
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
