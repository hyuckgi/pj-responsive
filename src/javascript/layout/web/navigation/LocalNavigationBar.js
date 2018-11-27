import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Menu } from 'antd';
import { service } from '../../../commons/configs';

const SubMenu = Menu.SubMenu;

const mapStateToProps = ({layout}) => {
    const allMenu = layout;

    return {
        layout
    };
}

const mapDispatchProps = dispatch => ({

});

class LocalNavigationBar extends React.Component {

    renderSubMenu(menu, width){
        const child = service.getValue(this.props, 'allMenu', []).filter(item => item.parent === menu.id);
        return (
            <SubMenu
                key={menu.id}
                title={menu.name}
                style={{width : `${width}%`}}
            >
                {child.map(item => {
                    return this.renderMenu(item);
                })}
            </SubMenu>
        )

    }

    renderMenu(menu, opt = null){
        const width = opt ? opt.width : 100;
        const crruent = service.getValue(this.props, 'currentMenu.id', false)
            ?  (service.getValue(this.props, 'currentMenu.id') === menu.id ? 'on' : '')
            : '';

        if(service.getValue(menu, 'hasChild', false)){
            return this.renderSubMenu(menu, width);
        }

        return(
            <Menu.Item
                key={menu.id}
                title={menu.name}
                style={{width : `${width}%`}}
                className={`${crruent}`}
            >
                <NavLink to={menu.link}>{menu.name}</NavLink>
            </Menu.Item>
        )
    }

    render() {
        const { subMenu } = this.props;

        return (
            <Menu
                mode="horizontal"
                className="local-navigation"
            >
                {subMenu.map(menu => {
                    const width = 100 / subMenu.length;
                    return this.renderMenu(menu, {width : width})
                })}
            </Menu>
        );
    }
}
export default connect(mapStateToProps, mapDispatchProps)(LocalNavigationBar);
