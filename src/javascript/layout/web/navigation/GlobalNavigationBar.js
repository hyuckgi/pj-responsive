import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';

import { Menu } from 'antd';
import { layout as action } from '../../../redux/actions';
import { service } from '../../../commons/configs';


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const mapStateToProps = ({ layout, router, security}) => {
    const pathname = service.getValue(router, 'location.pathname', false);
    const globalMenuList = (layout.list || []).filter(item => item.level === 0);
    const active = pathname && globalMenuList.filter(item => pathname.indexOf(item.link) === 0)[0];

    return {
        menus : globalMenuList,
        list : layout.list,
        defaultSelectedKeys: active ? active.id : undefined,
    }
};

const mapDispatchProps = dispatch => ({
    masterLevel1 : () => dispatch(action.masterLevel1()),
    masterLevel2 : () => dispatch(action.masterLevel2()),
    masterLevel3 : () => dispatch(action.masterLevel3()),
});

class GlobalNavigationBar extends React.Component {

    componentDidMount(prevProps) {
        // this.props.masterLevel1();
    }

    renderChild(menu){
        const { list } = this.props;

        if(!menu.hasChild){
            return;
        }

        return list.filter(item => item.parent === menu.id).map((item, idx) => {
            if(item.hasChild){
                return this.renderSubMenu(item);
            }
            return(<Menu.Item key={idx}>{item.name}</Menu.Item>)
        })
    }

    renderSubMenu(menu, opt = null){
        if(!menu){
            return;
        }

        const width = opt ? opt.width : 100;

        return(
            <SubMenu key={menu.id}  title={menu.name} style={{width : `${width}%`}}>
                {this.renderChild(menu)}
            </SubMenu>
        )
    }

    render() {
        const menus  = service.getValue(this.props, 'menus', []);

        return(
            <Menu mode="horizontal" defaultSelectedKeys={[this.props.defaultSelectedKeys]} className="global-navigation-bar" multiple={true}>
                {menus.map(menu => {
                    const width = 100 / menus.length;

                    if(menu.hasChild){
                        return this.renderSubMenu(menu, {width : width})
                    }else{
                        return(
                            <Menu.Item key={menu.id} style={{width:`${width}%`}}>
                                <NavLink to={ menu.defaultLink } activeClassName="active" >{menu.name}</NavLink>
                            </Menu.Item>
                        )
                    }
                })}
            </Menu>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(GlobalNavigationBar);
