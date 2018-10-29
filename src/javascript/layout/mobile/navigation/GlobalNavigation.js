import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Tabs } from 'antd-mobile';
import { Sticky } from 'react-sticky';

import { service, path } from '../../../commons/configs';
import { SubNavigation } from './';

const mobileLayout = [
    {id: '1080000', name: 'Detail', link: '/story/item/detail', level: 1, },
    {id: '1090000', name: 'Review', link: '/story/item/review', level: 1, },
];

const mapStateToProps = ({fetch}) => {
    const story = service.getValue(fetch, 'item.data', {});

    return {
        story
    }
};

const mapDispatchProps = dispatch => ({
    move: (location) => dispatch(push(location))
});


class GlobalNavigation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            subMenu : [],
        }

        this.renderTabBar = this.renderTabBar.bind(this);
        this.onChange = this.onChange.bind(this);
        this.moveTab = this.moveTab.bind(this);
        this.onSwipe = this.onSwipe.bind(this);

        this.getSubMenu = this.getSubMenu.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(service.getValue(prevProps, 'swipeObj.startTime', '') !== service.getValue(this.props, 'swipeObj.startTime', '')){
            return this.onSwipe(this.props.swipeObj);
        }
    }

    componentDidMount() {
        const { subMenu, currentPath } = this.props;
        this.getSubMenu(subMenu, currentPath)
    }

    componentWillReceiveProps(nextProps) {
        const { location } = this.props;
        if(JSON.parse(JSON.stringify(location)) !== JSON.parse(JSON.stringify(nextProps.location))){
            this.getSubMenu(nextProps.subMenu, nextProps.currentPath)
        }
    }

    globalSwipe(direction){
        const { globalMenu, currentMenu } = this.props;
        const globalIndex = currentMenu.idx;
        let swipe = {};

        switch (direction) {
            case 'next':
                if((globalIndex + 1) > (globalMenu.length - 1)){
                    swipe = globalMenu[0];
                }else{
                    swipe = globalMenu[globalIndex + 1];
                }
                break;

            case 'prev':
                if(globalIndex === 0){
                    swipe = globalMenu[globalMenu.length - 1];
                }else{
                    swipe = globalMenu[globalIndex - 1];
                }
                break;

            default:
                break;

        }
        return this.moveTab(swipe);
    }

    localSwipe(direction){
        const { subMenu, globalMenu, currentMenu, currentPath } = this.props;
        const globalIndex = currentMenu.idx;
        const subIndex = subMenu.findIndex(item => item.link === currentPath);

        let swipe = {};

        switch (direction) {
            case 'next':
                if((subIndex + 1) > (subMenu.length - 1)){
                    const idx = (globalIndex + 1) > (globalMenu.length - 1) ? 0 : (globalIndex + 1);
                    swipe = globalMenu[idx];
                }else{
                    swipe = subMenu[subIndex + 1];
                }
                break;

            case 'prev':
                if(subIndex === 0){
                    const idx = (globalIndex === 0) ? (globalMenu.length - 1) : (globalIndex - 1);
                    swipe = globalMenu[idx];
                }else{
                    swipe = subMenu[subIndex - 1];
                }
                break;
            default:
                break;
        }
        return this.moveTab(swipe);
    }

    onSwipe(swipeObj){
        const { subMenu, isGlobalMenu } = this.props;
        const moveStatus = service.getValue(swipeObj, 'moveStatus', false);

        if(!moveStatus || !isGlobalMenu){
            console.log("exept");
            return;
        }

        if(Math.abs(parseInt(moveStatus.x, 10)) < (window.innerWidth / 3)){
            return;
        }

        if(swipeObj.direction === 2){
            if(subMenu.length){
                return this.localSwipe('next');
            }
            return this.globalSwipe('next');
        }else if(swipeObj.direction === 4){
            if(subMenu.length){
                return this.localSwipe('prev');
            }
            return this.globalSwipe('prev');
        }
        return;
    }


    renderTab(layout){
        return(
            <span className={`navigation-menu-1depth navigation-menu ${layout.id === '4000000' ? 'prewarp' : '' }`}>{layout.name}</span>
        );
    }

    onChange(layout){
        return this.moveTab(layout);
    }

    moveTab(layout){
        const { location } = this.props;
        const link = service.getValue(layout, 'defaultLink', false) || service.getValue(layout, 'link', '/');

        if(link.indexOf(path.storyItem) === 0){
            const pathName = service.getValue(location, 'pathname', '').split('/');
            return this.props.move(path.moveItemStory(layout.name.toLowerCase(), pathName[pathName.length - 2]))
        }

        return this.props.move(link);
    }

    renderSubTab(){
        const { subMenu, subIndex } = this.state;
        if(!subMenu.length){
            return;
        }

        // if(subIndex < 0){
        //     return;
        // }
        return <SubNavigation tabs={subMenu} page={subIndex}/>
    }

    getSubMenu(subMenu, currentPath){
        let newSubMenu = [];
        const { story } = this.props;
        const flag = currentPath.indexOf(path.storyItem) === 0;
        const pathName = currentPath.split('/');

        if(flag){
            newSubMenu = service.getValue(story, 'reviewData', false) ? mobileLayout : [mobileLayout[0]];

        }else{
            newSubMenu = subMenu;
        }

        this.setState({
            subMenu : newSubMenu,
            subIndex : flag ? (pathName[pathName.length - 3] === 'detail' ? 0 : 1) : newSubMenu.findIndex(item => item.link === currentPath)
        })
    }

    renderTabBar(props) {
        return (
            <Sticky topOffset={70}>
                {({style, isSticky}) => {
                    return(
                        <div style={{...style, zIndex: 1 }} className={`${isSticky ? 'navigations-sticky' : 'navigations-relative'}`} >
                            <div className={`global-navigations`}>
                                <Tabs.DefaultTabBar
                                    {...props}
                                    renderTab={tab => this.renderTab(tab)}
                                />
                            </div>
                            {this.renderSubTab()}
                        </div>
                    );
                }}
            </Sticky>
        );
    }

    render() {
        const { globalMenu, currentMenu, children, isGlobalMenu } = this.props;
        const menus = globalMenu.filter(item => item.idx >= 0)
        return (
            <Tabs
                tabs={menus}
                page={isGlobalMenu ? currentMenu.idx : null}
                onChange={this.onChange}
                renderTabBar={this.renderTabBar}
                swipeable={false}
                prerenderingSiblingsNumber={0}
                destroyInactiveTab={true}
                tabBarUnderlineStyle={{display : 'none'}}
            >
                {children}
            </Tabs>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(GlobalNavigation);
