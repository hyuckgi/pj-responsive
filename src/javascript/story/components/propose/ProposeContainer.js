import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { APICaller } from '../../../commons/api'
import { fetch } from '../../../redux/creators'
import { service, api, path } from '../../../commons/configs'
import { values } from '../../configs';

import { Row, Col,  Tabs } from 'antd';
import { Steps } from 'antd-mobile';

import { Step01, Step02, Step03 } from './'

const Step = Steps.Step;
const { TabPane } = Tabs;

const mapStateToProps = ({fetch}) => {
    return {
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
        };

        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.getSteps = this.getSteps.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

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
        const { current, params } = this.state;
        const stepProps = {
            data : params,
            onClickNext : this.onClickNext,
            onClickPrev : this.onClickPrev,
            onSubmit : this.onSubmit
        };

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
