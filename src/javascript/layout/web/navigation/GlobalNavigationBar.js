import React from 'react';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';

import Menu from 'antd/lib/menu';
import {layout as action} from '../../../redux/actions';


const mapStateToProps = ({ layout, router, security}) => {
    const pathname = router;
    console.log("pathname", pathname);
    // const globalMenuList = (layout.list || []).filter(item => item.level === 0);

    return {
        // MenuList : globalMenuList,
    }
};

const mapDispatchProps = dispatch => ({
    masterLevel1 : () => dispatch(action.masterLevel1()),
    masterLevel2 : () => dispatch(action.masterLevel2()),
    masterLevel3 : () => dispatch(action.masterLevel3()),
});

class GlobalNavigationBar extends React.Component {

    componentDidMount(prevProps) {
        this.props.masterLevel1();
    }

    render() {
        const MenuList = this.props.MenuList;

        return(
            <Menu mode="horizontal" defaultSelectedKeys={[this.props.defaultSelectedKeys]} >
                {MenuList && MenuList.map(menu => (
                    <Menu.Item key={menu.id}>
                        <NavLink to={ menu.defaultLink } activeClassName="active" >{menu.name}</NavLink>
                    </Menu.Item>
                ))}
            </Menu>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(GlobalNavigationBar);
