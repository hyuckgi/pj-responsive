import React from 'react';
import PropTypes from 'prop-types';

import { Flex, WhiteSpace } from 'antd-mobile';

import { Buttons } from './';

class ButtonWrapper extends React.Component {

    onClickButton(id){
        return this.props.onClickButton(id);
    }

    render() {
        const { buttons } = this.props;

        return (
            <Flex justify="center" className="button-wrapper" >
                <Flex.Item>
                    <WhiteSpace size="xl" />
                    <Buttons buttons={buttons} onClickButton={this.onClickButton.bind(this)}/>
                    <WhiteSpace size="lg" />
                </Flex.Item>
            </Flex>
        );
    }

}

ButtonWrapper.propTypes = {
    buttons : PropTypes.array.isRequired,
    onClickButton : PropTypes.func.isRequired,
};

ButtonWrapper.defaultProps = {

};

export default ButtonWrapper;
