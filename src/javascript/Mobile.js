import React from 'react';
import { connect } from 'react-redux';

import Gesture from 'rc-gesture';
import { StickyContainer } from 'react-sticky';

import { Spinner, WrapperContainer, MobileWrapper, FooterContainer } from './layout';
import { HeaderContainer, DrawerContainer, FooterNavigation } from './layout/mobile';
import { service } from './commons/configs';

const mobileLayout = [
    {id: '100', name: 'Home',  level: 0,  link:'/main', defaultLink: '/main', idx : 0, mobile : true},
];

const mapStateToProps = ({ fetch, layout, router }) => {
    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, []).concat(mobileLayout);

    const globalMenu = service.getValue(layout, 'list', []).filter(item => item.level === 0).concat(mobileLayout).filter(item => item.mobile).sort((a, b) => a.id - b.id);
    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const keyword = currentPath.split("/")[1] === 'story' ? `${currentPath.split("/")[1]}/${currentPath.split("/")[2]}/${currentPath.split("/")[3]}` : currentPath.split("/")[1];
    const currentMenu = allMenu.filter(item => item.link.indexOf(keyword) === 1).find(item => item);

    const isGlobalMenu = globalMenu.some(item => item.id === service.getValue(currentMenu, 'id', 0));

    const subMenu = isGlobalMenu && service.getValue(currentMenu, 'defaultLink', false)
        ? allMenu.filter(item => item.parent ===  currentMenu.id)
        : false;

    return {
        allMenu,
        currentPath,
        globalMenu,
        currentMenu,
        isGlobalMenu,
        subMenu
    }

};

class Mobile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            swipeObj : {},
            onOpen : false,
        };

        this.onSwipe = this.onSwipe.bind(this);
        this.onEvents = this.onEvents.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
        this.onCloseChange = this.onCloseChange.bind(this);
    }

    onSwipe(swipeObj){
        const { onOpen } = this.state;
        if(onOpen){
            if(swipeObj.direction === 4){
                return this.onCloseChange();
            }
            return;
        }
        return this.setState({
            swipeObj
        });
    }

    onOpenChange(params = null){
        return this.setState({
            onOpen : true,
        })
    }

    onCloseChange(params = null){
        return this.setState({
            onOpen : false,
        })
    }

    onEvents(params){
        const { events } = params;

        switch (events) {
            case 'open':
                return this.onOpenChange(params);
            case 'close':
                return this.onCloseChange(params);
            default:
                break;
        }
    }

    render() {
        const { spinning, isGlobalMenu, allMenu } = this.props;
        const { onOpen, swipeObj } = this.state;

        return (
            <Gesture
                direction='horizontal'
                onSwipe = {this.onSwipe}
                >
                <div className="mobile-container">
                    <DrawerContainer status={onOpen} onEvents={this.onEvents} allMenu={allMenu}>
                        <HeaderContainer onEvents={this.onEvents} isGlobalMenu={isGlobalMenu}/>

                        <StickyContainer className="section">
                            <MobileWrapper {...this.props} swipeObj={swipeObj}>
                                <WrapperContainer {...this.props}/>
                            </MobileWrapper>

                            <FooterNavigation {...this.props}/>
                        </StickyContainer>

                        <FooterContainer />

                        <Spinner
                            toast={true}
                            tip="Loading..."
                            spinning={spinning}
                        />
                    </DrawerContainer>
                </div>
            </Gesture>
        );
    }

}

export default  connect(mapStateToProps)(Mobile);
