import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';

import { Flex, WingBlank, WhiteSpace, Button } from 'antd-mobile';

import { path } from '../../commons/configs';

const mapStateToProps = () => {
    return{
    }
}

const mapDispatchToProps = (dispatch) => ({
    move: (location) => dispatch(push(location))
});

class Page404 extends React.Component {

    constructor(props) {
        super(props);

        this.goBack = this.goBack.bind(this);
        this.goMain = this.goMain.bind(this);
    }

    goBack(){
        return this.props.history.go(-2);
    }

    goMain(){
        return this.props.move(path.home)
    }

    render() {
        return (
            <WingBlank className="error-container">
                <Flex justify="start" direction="column" wrap="nowrap" className="error-wrapper" align="center">
                    <Flex justify="center" direction="row" wrap="wrap">
                        <Flex.Item className="text">
                            <WhiteSpace size="lg" />
                            <h1>404</h1>
                            <p>Page Not Found</p>
                            <WhiteSpace size="lg" />
                        </Flex.Item>
                        <Flex.Item>
                            <Button onClick={this.goBack} className="btn-back" >이전페이지로 이동</Button>
                            <Button type="primary" onClick={this.goMain} >메인으로</Button>
                        </Flex.Item>
                    </Flex>
                </Flex>
            </WingBlank>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Page404));
