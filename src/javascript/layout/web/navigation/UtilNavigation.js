import React from 'react';
import { NavLink  } from 'react-router-dom';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';

import { Menu } from 'antd';
import { Modal } from 'antd-mobile';
import { service, path } from '../../../commons/configs';
import { CustomIcon } from '../../../commons/components'

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
        this.onClick = this.onClick.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    onLogout(){
        this.props.move(path.main);
        this.props.logout();
    }

    onClick(){
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
                    <NavLink to={path.login}>로그인</NavLink>
                </Menu.Item>
            )
        }

        return (
            <SubMenu
                title={<CustomIcon type="MdAccountCircle" style={{color:'#fff'}}/>}
            >
                {mypageMenus.filter((item) => item.level === 1).map((item, idx) => {
                    return this.renderItem(item);
                })}
            </SubMenu>
        )
    }

    renderItem(menu){
        if(menu.link === path.logout){
            return (
                <Menu.Item
                    key={menu.id}
                    onClick={this.onClick}
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
                    <NavLink to={path.propose}>스토리 제안</NavLink>
                </Menu.Item>
                <Menu.Item className="btn-search">
                    <NavLink to={path.search}>
                        <CustomIcon
                            type='MdSearch'
                            style={{color : '#fff'}}
                        />
                    </NavLink>
                </Menu.Item>
                {this.renderUser()}
            </Menu>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(UtilNavigation);
