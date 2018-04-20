import '../stylesheet/web.less';
import React from 'react';

import { connect } from 'react-redux';

import { Layout, BackTop, Icon, notification } from 'antd';

import { HeaderContainer, Spinner, WrapperContainer } from './layout/web';

notification.config({placement: 'topRight'});

const { Content } = Layout;

const mapStateToProps = ({ fetch }) => ({
    spinning : fetch.isFetching || fetch.isPosting,
    // show: !fetch.isPosting,
    // error: fetch.error
});

const mapDispatchProps = dispatch => ({
    // initialize: (cookies) => dispatch(action.tag(cookies)),
});

class Web extends React.Component {

    render() {
        return (
            <Layout className="web-container">
                <HeaderContainer {...this.props}/>

                <Content className="section">
                    <WrapperContainer />
                </Content>

                {/* <BackTop >
                    <div className="ant-back-top-inner"><Icon type="arrow-up" />TOP</div>
                </BackTop> */}
                <Spinner spinning={this.props.spinning}/>
            </Layout>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Web);
