import React from 'react';

import { APICaller } from '../../../commons/api';
import { ButtonWrapper } from '../../../commons/components';
import { Row, Col, Form } from 'antd';
import { service, api } from '../../../commons/configs';
import { FormButton } from '../../../commons/types';

import { ContentList } from '../';


class ReviewContainer extends React.Component {

    constructor(props) {
        super(props);

        this.getButtons = this.getButtons.bind(this);
    }

    onSubmit(){
        const { form, match } = this.props;
        const storyNo = service.getValue(match, 'params.id', false);
        const mode = service.getValue(match, 'params.mode', 'write');


        form.validateFields((errors, value) => {
            if(!errors && storyNo){
                const newContent = service.getValue(value, 'contentsList', []).reduce((result, item) => {
                    const imageNoList = service.getFileNo(service.getValue(item, 'images.fileList', []));
                    const videoNoList = service.getFileNo(service.getValue(item, 'videos.fileList', []));

                    const newItem = {
                        ...item,
                        imageNoList,
                        videoNoList
                    }
                    delete newItem['images'];
                    delete newItem['videos'];
                    result.push(newItem);
                    return result;
                }, []);


                const obj = api.postReview({
                    contentsList : [...newContent],
                    storyNo : storyNo,
                });

                const method = mode === 'write' ? 'post' : 'put';

                return APICaller[method](obj.url, obj.params)
                .then((...args) => {
                    console.log("res", args);
                });
            }
        });
    }

    onCancel(){
        this.props.history.goBack();
    }

    onClickButton(id){
        switch (id) {
            case FormButton.CANCEL:
                return this.onCancel();
            case FormButton.CONFIRM:
                return this.onSubmit();
            default:
                break;
        }
    }

    getButtons(){
        return [
            { id : FormButton.CANCEL, label : "취소", type : 'ghost'  },
            { id : FormButton.CONFIRM, label : "확인", style : { marginLeft: '5px'}},
        ];
    }

    render() {
        const { form } = this.props;

        return (
            <Row type="flex" justify="center" className="propose-container">
                <Col className="propose-wrapper">
                    <h2 style={{textAlign : 'center'}}>스토리 후기 작성</h2>
                    <ContentList form={form}/>

                    <ButtonWrapper buttons={this.getButtons()} onClickButton={this.onClickButton.bind(this)}/>
                </Col>
            </Row>
        );
    }

}

export default Form.create()(ReviewContainer);
