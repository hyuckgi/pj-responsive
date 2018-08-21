import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { APICaller } from '../../../commons/api'
import { fetch } from '../../../redux/creators'
import { service, api, path } from '../../../commons/configs'
import { values } from '../../configs';

import { Row, Col,  Tabs } from 'antd';
import { Steps, Modal } from 'antd-mobile';

import { Step01, Step02, Step03 } from './'

const Step = Steps.Step;
const { TabPane } = Tabs;
const alert = Modal.alert;

const mapStateToProps = ({fetch, security}) => {
    const token = service.getValue(security, 'token', false);

    return {
        token
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
    postStart : () => dispatch(fetch.postStart()),
    postEnd : () => dispatch(fetch.postEnd()),
});

class ProposeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current : 0,
            logined : service.getValue(this.props, 'token', false),
        };

        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.getSteps = this.getSteps.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        // this.renderModal = this.renderModal.bind(this);
    }

    // renderModal(){
    //     return alert('로그인을 해주세요.', '스토리를 제안하기 위해서는 로그인이 필요합니다.', [
    //
    //     ]);
    // }
    // componentDidMount() {
    //     const { token } = this.props;
    //
    //     if(!token){
    //
    //     }
    // }

    onClickNext(params){
        const steps = service.getValue(values, 'propose.steps', []);
        const { current } = this.state;
        const next = (current + 1) > (steps.length - 1) ? (steps.length - 1) : current + 1;

        return this.setState({
            current : next,
            params : {
                ...this.state.params,
                ...params
            }
        })
    }

    onClickPrev(){
        const { current } = this.state;
        const prev = (current - 1) < 0  ? 0 : current - 1;

        return this.setState({
            current : prev,
        })
    }

    onSubmit(data){
        const { params } = this.state;
        const obj = api.postStory({...params, ...data});

        this.props.postStart();
        return APICaller.post(obj.url, obj.params)
            .then(({data}) => {
                const id = service.getValue(data, 'storyNo', false);
                if(id){
                    this.props.postEnd();
                    return this.props.move(path.moveItem(path.storyItem, id));
                }
            })
            .catch((err) => {
                console.log('err', err);
            })
    }

    getSteps(){
        const { current } = this.state;
        const steps = service.getValue(values, 'propose.steps', []);

        return steps.map((item, inx) => {
            return(
                <Step
                    className={current === inx ? 'active' : 'inactive'}
                    key={item.id}
                    title={item.label}
                />
            );
        });
    }

    render() {
        const { current, params, logined } = this.state;
        const stepProps = {
            data : params,
            onClickNext : this.onClickNext,
            onClickPrev : this.onClickPrev,
            onSubmit : this.onSubmit
        };

        if(!logined){
            return (
                <div>
                    <Modal
                        visible={logined ? false : true}
                        transparent
                        maskClosable={false}
                        title="로그인이 필요한 메뉴입니다."
                        footer={[
                            {text : 'Cancel', onPress : () => this.props.move(path.main)},
                            {text : '로그인', onPress : () => this.props.move(path.login)}
                        ]}
                    >
                        {`스토리를 제안하려면 로그인이 필요합니다.
                          로그인을 해주세요.`}
                    </Modal>
                </div>
            )
        }

        return (
            <Row type="flex" justify="center" className="propose-container">
                <Col className="propose-wrapper">
                    <Steps
                        current={current}
                        direction="horizontal"
                        className="propose-steps"
                    >
                        {this.getSteps()}
                    </Steps>

                    <Tabs
                        activeKey={(current + 1).toString()}
                        defaultActiveKey={"1"}
                        tabBarStyle={{display : 'none'}}
                    >
                        <TabPane tab="" key="1">
                            {(<Step01 stepProps={stepProps} />)}
                        </TabPane>
                        <TabPane tab="" key="2">
                            {(<Step02 stepProps={stepProps} />)}
                        </TabPane>
                        <TabPane tab="" key="3">
                            {(<Step03 stepProps={stepProps} />)}
                        </TabPane>

                    </Tabs>
                </Col>
            </Row>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(ProposeContainer);
