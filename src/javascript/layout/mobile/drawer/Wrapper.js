import React from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';

import { service, path, api } from '../../../commons/configs';
import { CustomIcon } from '../../../commons/components';
import { fetch } from '../../../redux/actions';

import { List,  } from 'antd-mobile';
import { Avatar, Menu } from 'antd';

const SubMenu = Menu.SubMenu;

const icons = {
    '100' : (<CustomIcon type="FaHeartO" roots="FontAwesome"/>),
    '1000000' : (<CustomIcon type="FaHome" roots="FontAwesome"/>),
    '2000000' : (<CustomIcon type="FaTrophy" roots="FontAwesome"/>),
    '3000000' : (<CustomIcon type="FaBullhorn" roots="FontAwesome"/>),
    '4000000' : (<CustomIcon type="FaPlusSquareO" roots="FontAwesome"/>),
    '4010000' : (<CustomIcon type="FaCommentingO" roots="FontAwesome"/>),
    '4010100' : (<CustomIcon type="FaListAlt" roots="FontAwesome"/>),
    '4010200' : (<CustomIcon type="FaEdit" roots="FontAwesome"/>),
    '4020000' : (<CustomIcon type="FaWpforms" roots="FontAwesome"/>),
    '4020100' : (<CustomIcon type="FaFileTextO" roots="FontAwesome"/>),
    '4020200' : (<CustomIcon type="FaFileText" roots="FontAwesome"/>),
};

const mapStateToProps = ({fetch, security}) => {
    const userInfo = security || {};
    const profile = service.getValue(fetch, 'item.data', false);

    return {
        userInfo,
        profile
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location)),
    getItem : (url) => dispatch(fetch.get(url)),
});

class Wrapper extends React.Component {

    constructor(props) {
        super(props);

        this.getUser = this.getUser.bind(this);
        this.renderUser = this.renderUser.bind(this);

        this.onLogin = this.onLogin.bind(this);
        this.onClickMypage = this.onClickMypage.bind(this);

        this.renderSubMenu = this.renderSubMenu.bind(this);
    }

    componentDidMount() {
        const token = service.getValue(this.props, 'userInfo.token', false);
        if(token){
            this.getUser();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(service.getValue(prevProps, 'userInfo.token', false) !== service.getValue(this.props, 'userInfo.token', false)){
            this.getUser();
        }
    }

    getUser(){
        const obj = api.getProfile();

        return this.props.getItem(obj.url);
    }

    onLogin(){
        const { onOpenChange } = this.props;
        if(onOpenChange){
            onOpenChange(false, {overlayClicked : true})
        }
        return this.props.move(path.login);
    }

    onClickMypage(){
        const { onOpenChange } = this.props;
        if(onOpenChange){
            onOpenChange(false, {overlayClicked : true})
        }
        return this.props.move(path.defaultMypageList);
    }

    renderUser(){
        const { profile } = this.props;
        const profileUrl = service.getValue(profile, 'profileUrl', false);

        if(!profile){
            return (
                <List className="user notlogined">
                    <List.Item
                        onClick={this.onLogin}
                        thumb={(<Avatar icon="user" />)}
                    >
                        Login
                    </List.Item>
                </List>
            )
        }

        return(
            <List className="user logined">
                <List.Item
                    onClick={this.onClickMypage}
                    thumb={profileUrl ? (<Avatar src={profileUrl} />) : (<Avatar icon="user" />)}
                >
                    {service.getValue(profile, 'username', profile.userid)}
                </List.Item>
            </List>
        )
    }

    onClick(item){
        const link = service.getValue(item, 'defaultLink', item.link);
        const { onOpenChange } = this.props;
        if(onOpenChange){
            onOpenChange(false, {overlayClicked : true})
        }
        return this.props.move(link);
    }

    renderMenu(item){
        const icon = service.getValue(icons, `${item.id}`, null);

        return (
            <Menu.Item
                key={item.id}
                onClick={this.onClick.bind(this, item)}
            >
                {icon}<span>{item.name}</span>
            </Menu.Item>)
    }

    renderSubMenu(menus){
        if(!Array.isArray(menus)){
            return null;
        }
        const { allMenu } = this.props;

        return menus.map(menu => {
            if(menu.hasChild){
                const child = allMenu.filter(item => item.parent === menu.id);
                const icon = service.getValue(icons, `${menu.id}`, null);

                return (
                    <SubMenu
                        key={menu.id}
                        title={<span>{icon}<span>{menu.name}</span></span>}
                    >
                        {this.renderSubMenu(child)}
                    </SubMenu>
                )
            }
            return this.renderMenu(menu);
        });
    }

    render() {
        const { allMenu } = this.props;
        const firstLevel = allMenu.filter(item => item.level === 0).sort((a,b) => a.id - b.id);

        return (
            <div className="sidebar-wrapper">
                {this.renderUser()}
                <Menu
                    mode="inline"
                    selectedKeys={[]}
                >
                    {this.renderSubMenu(firstLevel)}
                </Menu>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Wrapper);
