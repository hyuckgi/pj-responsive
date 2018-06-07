import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Sticky } from 'react-sticky';
import { Menu } from 'antd';
import { service } from '../../../commons/configs';

const mapStateToProps = () => {
    return {};
}

const mapDispatchProps = dispatch => ({

});

class LocalNavigationBar extends React.Component {

    renderMenu(menu, opt = null){

        const width = opt ? opt.width : 100;
        const crruent = service.getValue(this.props, 'currentMenu.id', false)
            ?  (service.getValue(this.props, 'currentMenu.id') === menu.id ? 'on' : '')
            : '';

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
            <Sticky topOffset={1}>
                {({style}) => {
                    const newStyle = {
                        ...style,
                        top: 80,
                    }
                    return(
                        <Menu
                            mode="horizontal"
                            className="local-navigation"
                            style={{...newStyle, zIndex : 1}}>
                            {subMenu.map(menu => {
                                const width = 100 / subMenu.length;
                                return this.renderMenu(menu, {width : width})
                            })}
                        </Menu>
                    )
                }}
            </Sticky>
        );
    }
}
export default connect(mapStateToProps, mapDispatchProps)(LocalNavigationBar);
