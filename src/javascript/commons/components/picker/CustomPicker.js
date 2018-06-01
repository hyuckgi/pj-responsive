import React from 'react';
import PropTypes from 'prop-types';

import { DesktopLayout, MobileLayout } from '../response';
import { service } from '../../configs';

import { Cascader } from 'antd';

class CustomPicker extends React.Component {


    onChange(){
        const { onChange } = this.props;

        if(onChange){
            onChange();
        }
    }

    convertOptions(options){
        return service.mappingKey(options);
    }


    render() {
        const { options, key } = this.props;

        console.log("options", options);
        return (
            <div className="custom-picker">
                <DesktopLayout>
                    <Cascader
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
    key : PropTypes.string.isRequired,
};

CustomPicker.defaultProps = {
    options : [],
    key : 'category'
};

export default CustomPicker;
