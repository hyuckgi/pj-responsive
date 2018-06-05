import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { APICaller } from '../../commons/api';

import { service, values, path, api } from '../../commons/configs';

import { Tabs, Flex, Steps, Modal, WhiteSpace, Toast } from 'antd-mobile';

import { JoinStep01, JoinStep02, JoinStep03 } from './';


const Step = Steps.Step;


const mapDispatchToProps = (dispatch) => ({
    moveHome: () => dispatch(push('/')),
});

class Join extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current : 0,
        };

        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onNext = this.onNext.bind(this);
    }

    getSteps(){
        const { current } = this.state;
        const type = service.getValue(values, 'requestType', {});
        return Object.keys(type).map((item, inx) => {
            return (
                <Step
                    className={current === inx ? 'active' : 'inactive'}
                    key={inx}
                    title={type[item].label}
                />
            );
        });
    }

    getTabs(){
        const type = service.getValue(values, 'requestType', {});
        return Object.keys(type)
            .map((item, inx) => {
                return {title : ''}
            })
    }

    onSubmit(data){
        const { params } = this.state;
        const obj = api.join({...data, ...params});

        console.log("obj", obj);

        // APICaller.post(obj.url, obj.params)
        // .then(({data}) => {
        //     console.log("data", data);
        //     if(data.resultCode === 200){
        //         return Toast.success(`회원가입을 축하합니다.`, 2, this.props.moveHome());
        //     }
        // })
        // .catch((err) => {
        //     if(err){
        //         return Toast.fail(`회원가입에 실패했습니다. 다시 진행해 주세요`, 2, window.location.reload());
        //     }
        // })
    }

    onChange(tab, idx){
        return
    }

    onClickNext(params){
        this.setState({
            params : {
                ...this.state.params,
                ...params
            }
        });
        return this.onNext();
    }

    onNext(){
        const { current } = this.state;
        const type = service.getValue(values, 'requestType', {});
        const next = (current + 1) > (Object.keys(type).length - 1) ? (Object.keys(type).length - 1) : current + 1;

        return this.setState({
            current : next,
        })
    }

    onClickPrev(){
        const { current } = this.state;
        const prev = (current - 1) < 0  ? 0 : current - 1;

        return this.setState({
            current : prev,
        })
    }

    onTabClick(){
        return;
    }

    render() {
        const { current, visible, params } = this.state;
        const stepProps = {
            data : params,
            onClickNext : this.onClickNext,
            onClickPrev : this.onClickPrev,
            onSubmit : this.onSubmit
        };

        return (
            <div className="join-container">
                <Flex justify="start" direction="column" wrap="nowrap" className="join-wrapper" align="center" >
                    <Flex justify="center" direction="row" wrap="wrap">
                        <Flex.Item>
                            <WhiteSpace size="xl" />
                            <h2 className="title">회원가입</h2>
                        </Flex.Item>

                        <Flex.Item>
                            <Steps
                                current={current}
                                direction="horizontal"
                                size="small"
                                className="request-steps"
                            >
                                {this.getSteps()}
                            </Steps>
                        </Flex.Item>

                        <Flex.Item>
                            <Tabs
                                tabs={this.getTabs()}
                                initialPage={0}
                                page={current}
                                swipeable={false}
                                onChange={this.onChange.bind(this)}
                                tabBarBackgroundColor='transparent'
                                tabBarTextStyle={{fontSize:'13px'}}
                                tabBarUnderlineStyle={{display : 'none'}}
                                destroyInactiveTab={true}
                                prerenderingSiblingsNumber={0}
                                onTabClick={this.onTabClick}
                            >
                                <JoinStep01
                                    stepProps={stepProps}
                                />

                                <JoinStep02
                                    stepProps={stepProps}
                                />

                                <JoinStep03
                                    stepProps={stepProps}
                                />
                            </Tabs>
                        </Flex.Item>
                    </Flex>
                </Flex>

            </div>
        );
    }

}

export default connect(null, mapDispatchToProps)(Join);
