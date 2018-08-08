import React from 'react';
import { NavLink  } from 'react-router-dom';
import {connect} from 'react-redux';

import { Menu } from 'antd';
import { service, path } from '../../../commons/configs';
import { CustomIcon } from '../../../commons/components'

const SubMenu = Menu.SubMenu;


const mapStateToProps = () => {
    return {}
};

const mapDispatchProps = dispatch => ({

});

class UtilNavigation extends React.Component {

    render() {
        return (
            <Menu
                mode="horizontal"
                className="util-navigation"
            >
                <Menu.Item>
                    <NavLink to={path.propose}>스토리 제안</NavLink>
                </Menu.Item>
                <Menu.Item className="btn-search">
                    <NavLink to={path.search}>
                        <CustomIcon
                            type='MdSearch'
                        />
                    </NavLink>
                </Menu.Item>
                <Menu.Item>
                    <NavLink to={path.login}>로그인</NavLink>
                </Menu.Item>
            </Menu>
        );
    }

}

export default UtilNavigation;
