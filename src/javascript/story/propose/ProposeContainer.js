import React from 'react';

import { DesktopLayout, MobileLayout } from '../../commons/components/response';
import { service, values } from '../../commons/configs'

import { Tabs, Flex, Steps, WingBlank, Modal, WhiteSpace, Toast } from 'antd-mobile';

import { Step01 } from './'

const Step = Steps.Step;

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
        console.log("onSubmit", data);
    }

    onChange(tab, idx){
        console.log("idx", idx);
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

    onTabClick(){
        return;
    }

    getTabs(){
        const steps = service.getValue(values, 'propose.steps', []);

        return steps.map((item, inx) => {
                return {title : ''}
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
            <WingBlank className="propose-container">
                <Flex justify="start" direction="column" wrap="nowrap" className="propose-wrapper" align="center" >
                    <Flex justify="center" direction="row" wrap="wrap" >
                        <Flex.Item>
                            <Steps
                                current={current}
                                direction="horizontal"
                                className="propose-steps"
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
                                <Step01 stepProps={stepProps}/>

                                <div>ddd222</div>

                                <div>ddd333</div>
                            </Tabs>
                        </Flex.Item>
                    </Flex>
                </Flex>

            </WingBlank>
        );
    }

}

export default ProposeContainer;
