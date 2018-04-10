import React from 'react';

import { GlobalNavigationBar } from '../index';

import Layout from 'antd/lib/layout';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Dropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
const { Header } = Layout;


const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://teacher.wink.co.kr/client/teacher_center/"><Icon type="team"/>윙크교사센터</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://admin.wink.co.kr/client/warehouse/"><Icon type="shopping-cart"/>물류센터</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://admin.wink.co.kr/client/cs_center"><Icon type="customer-service"/>공감센터</a>
        </Menu.Item>
    </Menu>
);


class HeaderContainer extends React.Component {


    goHome() {
        this.props.history.push('/');
    }

    render() {
        return (
            <Header>
                <Row>
                    <Col span={4} className="logo" >
                        <img src="https://s.wink.co.kr/images/wink_admin/logo.png" alt="logo" onClick={this.goHome.bind(this)}/>
                    </Col>

                    <Col span={16}>
                        <GlobalNavigationBar />
                    </Col>

                    <Col className="dropdown" span={4}>
                        <Dropdown overlay={menu} placement="bottomLeft">
                          <Button>다른 관리자센터<Icon type="down" /></Button>
                        </Dropdown>
                    </Col>

                </Row>
            </Header>
        );
    }

}

export default HeaderContainer;
