import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { Layout, BackTop, Icon, notification } from 'antd';

import { HeaderContainer, LocalNavigationBar, Spinner } from './layout/web';
import { MainContainer } from './main/web';

const { Content, Sider } = Layout;
notification.config({placement: 'topRight'});


const mapStateToProps = ({ fetch }) => ({
    // spinning : fetch.isFetching || fetch.isPosting,
    // show: !fetch.isPosting,
    // error: fetch.error
});

const mapDispatchProps = dispatch => ({
    // initialize: (cookies) => dispatch(action.tag(cookies)),
});


class Web extends React.Component {

    onChange(date, dateString) {
      console.log(date, dateString);
    }

    render() {
        return (
            <Layout className="web-container">
                <HeaderContainer />
                <Layout>
                    <Sider width={240} >
                        <div className='local-navigation-bar'>
                            <LocalNavigationBar/>
                        </div>
                    </Sider>
                    <Layout className='wrapper'>
                        <Layout className="section">
                            <Content >
                                <Switch>
                                    <Route exact path="/" component={MainContainer}/>
                                </Switch>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>

                <BackTop >
                    <div className="ant-back-top-inner"><Icon type="arrow-up" />TOP</div>
                </BackTop>
                <Spinner spinning={this.props.spinning}/>
            </Layout>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Web);
