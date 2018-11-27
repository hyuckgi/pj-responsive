import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { service } from '../../../commons/configs';

import { Tabs, Flex } from 'antd-mobile';

import { Profile } from '../';
import { AccountList } from '../../../commons/components';

const mapStateToProps = ({ router, layout, security }) => {
    const mypageMenus = service.getValue(layout, 'mypageMenus', []);
    const currentPath = service.getValue(router, 'location.pathname', false);
    const currentMenu = currentPath && mypageMenus.filter(item => item.link === currentPath).find(item => item);
    const subMenu = mypageMenus.filter(item => item.parent ===  currentMenu.parent)
        .map((item, inx) => {
            item['title'] = item.name;
            item['key'] = inx + 1;
            return item;
        });
    const role = service.getValue(security, 'role', false);

    return{
        currentMenu,
        subMenu,
        role
    }
};

const mapDispatchProps = dispatch => ({
    move: (path) => dispatch(push(path))
});

class SettingTop extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected : '',
        }

        this.onMove = this.onMove.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    onMove(path){
        return this.props.move(path);
    }

    onChange(item, inx){
        return this.onMove(item.link);
    }

    onTabClick(item, inx){
        return this.onMove(item.link);
    }

    renderContent(item){
        const { type } = this.props;
        const selected = service.getValue(item, 'id', '601000000');

        if(!type || !selected){
            return;
        }

        switch (selected) {
            case '602000000':
                return (<AccountList />);
            default:
                return (<Profile />);
        }
    }

    render() {
        const { subMenu, currentMenu, role } = this.props;
        const permitMenu = role === 3 ? subMenu.filter(item => item.id === '601000000') : subMenu;

        return (
            <div className="setting-wrap">
                <Flex className="setting-wrap-top">
                    <Flex.Item className="title" style={{textAlign : 'center'}}>
                        {service.getValue(currentMenu, 'name', '')}
                    </Flex.Item>
                    <Flex.Item className="text-area">
                        {`(${service.getValue(currentMenu, 'descript', '')})`}
                    </Flex.Item>
                </Flex>

                <Tabs
                    tabs={permitMenu}
                    page={permitMenu.findIndex(item => item.id === currentMenu.id)}
                    swipeable={false}
                    onChange={this.onChange}
                    onTabClick={this.onTabClick}
                    prerenderingSiblingsNumber={0}
                    destroyInactiveTab={true}
                    tabBarBackgroundColor={service.isMobile() ? '#f7f8f9' : '#FF6E59'}
                    tabBarUnderlineStyle={service.isMobile() ? {} : {display:'none'}}
                >
                    {this.renderContent}
                </Tabs>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(SettingTop);
