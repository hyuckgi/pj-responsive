import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';

import { Menu } from 'antd';
import { layout as action } from '../../../redux/actions';
import { service } from '../../../commons/configs';

const SubMenu = Menu.SubMenu;

const mapStateToProps = () => {
    return {}
};

const mapDispatchProps = dispatch => ({
    masterLevel1 : () => dispatch(action.masterLevel1()),
    masterLevel2 : () => dispatch(action.masterLevel2()),
    masterLevel3 : () => dispatch(action.masterLevel3()),
});

class GlobalNavigation extends React.Component {

    constructor(props) {
        super(props);

        this.getCurrent = this.getCurrent.bind(this);
        this.renderSubMenu = this.renderSubMenu.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
    }

    componentDidMount() {
        // this.props.masterLevel1();
    }

    renderSubMenu(menu){
        const child = service.getValue(this.props, 'allMenu', []).filter(item => item.parent === menu.id);

        return(
            <SubMenu
                key={menu.id}
                title={menu.name}
                className={`${this.getCurrent(menu)}`}
            >
                {child.map(item => {
                    return this.renderMenu(item);
                })}
            </SubMenu>
        )
    }

    renderItem(menu){
        return(
            <Menu.Item
                key={menu.id}
                className={`${this.getCurrent(menu)}`}
            >
                <NavLink to={menu.defaultLink || menu.link}>{menu.name}</NavLink>
            </Menu.Item>
        )
    }

    getCurrent(menu){
        return service.getValue(this.props, 'currentMenu.link', false)
            ? (service.getValue(this.props, 'currentMenu.link').indexOf(menu.link) === 0 ? 'on' : '')
            : '';
    }

    renderMenu(menu){
        if(!menu){
            return;
        }

        if(service.getValue(menu, 'hasChild', false)){
            return this.renderSubMenu(menu);
        }
        return this.renderItem(menu)
    }

    render() {
        const { globalMenu } = this.props;

        return(
            <Menu
                mode="horizontal"
                className="global-navigation"
            >
                {globalMenu.map(menu => {
                    return this.renderMenu(menu)
                })}
            </Menu>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(GlobalNavigation);
