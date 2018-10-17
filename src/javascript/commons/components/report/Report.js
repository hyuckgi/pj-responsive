import React from 'react';
import { createForm } from 'rc-form';
import PropTypes from 'prop-types';

import { APICaller } from '../../../commons/api';
import { Modal, List, Radio, Flex, TextareaItem, Toast } from 'antd-mobile';
import { service, values, api } from '../../configs';

class Report extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible : true,
            reason : 11,
        }

        this.onClose = this.onClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.makeToast = this.makeToast.bind(this);
        this.errorToast = this.errorToast.bind(this);
    }

    makeToast(messages){
        const duration = messages.length;
        return Toast.fail(
            (<div>
                {messages.map((message, idx) => {
                    return (<p key={idx}>{message}</p>)
                })}
            </div>)
            , duration
        );
    }

    errorToast(errors = null){
        const { getFieldError } = this.props.form;
        if(!errors){
            return;
        }

        const messages = Object.keys(errors)
            .map(item => {
                return getFieldError(item);
            })
            .reduce((result, item, idx) => {
                return result.concat(item);
            }, []);

        return this.makeToast(messages);
    }

    onClose(){
        const { onEvents } = this.props;

        this.setState({
            visible : false,
        }, () => {
            onEvents({events : 'close'})
        })
    }

    onSubmit(){
        const { form, item } = this.props;
        const { reason } = this.state;
        const storyNo = service.getValue(item, 'storyNo', null);
        const replyNo = service.getValue(item, 'replyNo', null);

        form.validateFields((errors, value) => {
            const content = service.getValue(value, 'contents', "")

            if(reason === 99){
                if(!content){
                    return Toast.fail('신고사유를 입력해주세요', 1);
                }
            }

            if(!errors){
                const params = {reason, storyNo, replyNo, contents : content};
                const obj = api.postReport(params);

                APICaller.post(obj.url, obj.params)
                .then(({data}) => {
                    const resultCode = service.getValue(data, 'resultCode', false);
                    if(resultCode && resultCode === 200){
                        return Toast.success('신고가 정상적으로 접수되었습니다.', 1, this.onClose);
                    }
                })
            }

            return this.errorToast(errors);
        });
    }

    onClick(item, e){
        e && e.preventDefault();

        return this.setState({
            reason : item.value
        });
    }

    render() {
        const { visible, reason } = this.state;
        const { form } = this.props;
        const { getFieldProps } = form;
        const isMobile = service.isMobile();

        return (
            <Modal
                visible={visible}
                closable={true}
                className={service.getMobileClassName("report-wrapper")}
                transparent={isMobile ? false : true}
                popup={isMobile ? true : false}
                animationType={isMobile ? 'slide-up' : 'fade'}
                maskClosable={false}
                onClose={this.onClose}
                title="신고사유"
                footer={[
                    {text : 'Cancel', onPress : () => this.onClose()},
                    {text : 'OK', onPress : () => this.onSubmit()}
                ]}
            >
                <List full="true">
                    <Flex align="center" wrap="wrap">
                        {values.report.categories.map((item, idx) => (
                            <Flex.Item key={idx} className="circle-radio" onClick={this.onClick.bind(this, item)}>
                                <Radio
                                    checked={item.value === reason}
                                >{item.label}</Radio>
                            </Flex.Item>
                        ))}
                    </Flex>

                    <TextareaItem
                        {...getFieldProps('contents')}
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
