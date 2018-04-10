import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';

import { Menu } from 'antd';
import { layout as action } from '../../../redux/actions';
import { service } from '../../../commons/configs';


const mapStateToProps = ({ layout, router, security}) => {
    const pathname = service.getValue(router, 'location.pathname', false);
    const globalMenuList = (layout.list || []).filter(item => item.level === 0);
    const active = pathname && globalMenuList.filter(item => pathname.indexOf(item.link) === 0)[0];

    return {
        menus : globalMenuList,
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

    render() {
        const menus  = service.getValue(this.props, 'menus', []);

        return(
            <Menu mode="horizontal" defaultSelectedKeys={[this.props.defaultSelectedKeys]} >
                {menus.map(menu => (
                    <Menu.Item key={menu.id}>
                        <NavLink to={ menu.defaultLink } activeClassName="active" >{menu.name}</NavLink>
                    </Menu.Item>
                ))}
            </Menu>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(GlobalNavigationBar);
