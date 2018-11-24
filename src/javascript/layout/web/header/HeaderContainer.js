import React from 'react';
import { Sticky } from 'react-sticky';

import { GlobalNavigation, UtilNavigation } from '../index';
import { Row, Col, Layout } from 'antd';

import imgLogo from '../../../../resource/commons/logo2.png'

import { path } from '../../../commons/configs';

const { Header } = Layout;


class HeaderContainer extends React.Component {


    onClick() {
        this.props.history.push(path.main);
    }

    renderTabBar(){
        return(
            <GlobalNavigation {...this.props}/>
        )
    }

    renderUtils(){
        return(
            <UtilNavigation />
        )
    }

    render() {
        return (
            <div style={{ zIndex: 100}}>
                <Sticky topOffset={1}>
                    {({style, isSticky}) => {
                        return(
                            <Header id="header" className={`header-container ${isSticky ? 'header-container-sticky' : 'header-container-relative' }`} style={{...style, zIndex: 100 }}>
                                <Row type="flex" justify="space-between" align="middle" className="header-wrap" >
                                    <Col span={4} className="logo" onClick={this.onClick.bind(this)}>
                                        <img src={imgLogo} alt="logo"/> 9Spoons
                                    </Col>
                                    <Col span={11} offset={1} className="global-navigation-wrap">
                                        {this.renderTabBar()}
                                    </Col>
                                    <Col className="dropdown" span={6} offset={2}>
                                        {this.renderUtils()}
                                    </Col>
                                </Row>
                            </Header>
                        );
                    }}
                </Sticky>
            </div>
        );
    }

}

export default HeaderContainer;
