import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';

import { Menu } from 'antd';
import { Modal } from 'antd-mobile';
import { service, path } from '../../../commons/configs';
import { CustomIcon } from '../../../commons/components';

import { security as action } from '../../../redux/actions';

const SubMenu = Menu.SubMenu;

const mapStateToProps = ({layout, security}) => {
    const userInfo = security || {};
    const mypageMenus = service.getValue(layout, 'mypageMenus', [])

    return {
        userInfo,
        mypageMenus
    }
};

const mapDispatchProps = dispatch => ({
    logout : () => dispatch(action.logout()),
    move: (location) => dispatch(push(location)),
});

class UtilNavigation extends React.Component {

    constructor(props) {
        super(props);

        this.renderUser = this.renderUser.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    onLogout(){
        this.props.move(path.main);
        this.props.logout();
    }

    onClick(menu){
        if(menu.link === path.admin){
            return window.open(menu.defaultLink);
        }

        return Modal.alert('로그아웃', '로그아웃 하시겠습니까?', [
            { text : 'Cancel', onPress : () => console.log("cancel")},
            { text : 'OK', onPress : () => this.onLogout() }
        ]);
    }

    renderUser(){
        const { userInfo, mypageMenus } = this.props;

        if(!Object.keys(userInfo).length){
            return(
                <Menu.Item>
                    <NavLink to={path.login}>Login</NavLink>
                </Menu.Item>
            )
        }

        return (
            <SubMenu
                title={<CustomIcon type="MdAccountCircle" style={{color:'#FF6E59'}}/>}
            >
                {mypageMenus.filter((item) => item.level === 1).map((item, idx) => {
                    return this.renderItem(item);
                })}
            </SubMenu>
        )
    }

    renderItem(menu){
        const linkTo = service.getValue(menu, 'linkTo', false);
        if(linkTo === 'direct'){
            return (
                <Menu.Item
                    key={menu.id}
                    onClick={this.onClick.bind(this, menu)}
                >
                    {menu.name}
                </Menu.Item>
            )
        }

        return(
            <Menu.Item
                key={menu.id}
            >
                <NavLink to={menu.defaultLink}>{menu.name}</NavLink>
            </Menu.Item>
        )
    }

    render() {

        return (
            <Menu
                mode="horizontal"
                className="util-navigation"
            >
                <Menu.Item>
                    <NavLink to={path.propose}>Proposition</NavLink>
                </Menu.Item>
                <Menu.Item className="btn-search">
                    <NavLink to={path.search}>
                        <CustomIcon
                            type='MdSearch'
                            style={{color : '#FF6E59'}}
                        />
                    </NavLink>
                </Menu.Item>
                {this.renderUser()}
            </Menu>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(UtilNavigation);
