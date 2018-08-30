import React from 'react';
import { createForm } from 'rc-form';
import PropTypes from 'prop-types';

import { Modal, List, InputItem, Radio, Flex, TextareaItem } from 'antd-mobile';

import { service, values } from '../../configs';


class Report extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : true,
            radioValue : 11,
        }

        this.onClose = this.onClose.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onClose(){
        this.setState({
            visible : false,
        })
    }

    onClick(item, e){
        e && e.preventDefault();

        return this.setState({
            radioValue : item.value
        });
    }

    onChange(...args){
        console.log("args", args);
    }

    render() {
        const { visible, radioValue } = this.state;
        const { form } = this.props;
        const { getFieldProps, getFieldError } = form;

        return (
            <Modal
                visible={visible}
                closable
                className="report-wrapper"
                transparent
                maskClosable={false}
                onClose={this.onClose}
                title="신고 사유"
                footer={[
                    {text : 'Cancel', onPress : () => console.log("cancel")},
                    {text : 'OK', onPress : () => console.log("ok")}
                ]}
            >
                <List full="true">
                    <Flex align="center" wrap="wrap">
                        {values.report.categories.map((item, idx) => (
                            <Flex.Item key={idx} className="circle-radio" onClick={this.onClick.bind(this, item)}>
                                <Radio
                                    checked={item.value === radioValue}
                                    onChange={this.onChange}
                                >{item.label}</Radio>
                            </Flex.Item>
                        ))}
                    </Flex>

                    <TextareaItem
                        {...getFieldProps('content')}
                        rows={5}
                        count={100}
                    />
                </List>
            </Modal>
        );
    }
}

Report.propTypes = {
    visible: PropTypes.bool.isRequired,
};

Report.defaultProps = {
    visible : false,
};

export default createForm()(Report);
