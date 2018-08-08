import React from 'react';
import { Sticky } from 'react-sticky';

import { GlobalNavigation, UtilNavigation } from '../index';
import { Row, Col, Dropdown, Layout, Button, Menu, Icon } from 'antd';

import imgLogo from '../../../../resource/commons/logo.png'

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
            <Sticky topOffset={1}>
                {({style}) => {
                    return(
                        <Header id="header" className="header-container" style={{...style, zIndex: 100 }}>
                            <Row type="flex" justify="space-between" align="middle" className="header-wrap" >
                                <Col span={4} className="logo" >
                                    <img src={imgLogo} alt="logo" onClick={this.onClick.bind(this)}/>
                                </Col>
                                <Col span={10} offset={1} className="global-navigation-wrap">
                                    {this.renderTabBar()}
                                </Col>
                                <Col className="dropdown" span={8} offset={1}>
                                    {this.renderUtils()}
                                </Col>
                            </Row>
                        </Header>
                    );
                }}
            </Sticky>
        );
    }

}

export default HeaderContainer;
