import React from 'react';
import { connect } from 'react-redux';

import { Layout, notification } from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';

import { Spinner, WrapperContainer, FooterContainer } from './layout';
import { HeaderContainer, LocalNavigationBar } from './layout/web';

import { service } from './commons/configs';

notification.config({placement: 'topRight'});

const { Content } = Layout;

const mapStateToProps = ({ fetch, layout, router }) => {

    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, []);
    const globalMenu = service.getValue(layout, 'list', []).filter(item => item.level === 0);
    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const currentMenu = allMenu.filter(item => item.link === currentPath).find(item => item);

    return{
        globalMenu,
        currentMenu,
        allMenu,
    }
}

const mapDispatchProps = dispatch => {
    return{}
};

class Web extends React.Component {
    constructor(props) {
        super(props);
        this.renderSubMenu = this.renderSubMenu.bind(this);
    }

    renderSubMenu(){
        const { currentMenu, allMenu, globalMenu } = this.props;
        const parent = service.getValue(currentMenu, 'parent', false);
        const parentMenu = globalMenu.filter(item => item.id === parent).find(item => item);

        const subMenu = (parent && parent !== '500000000' && parent !== '600000000' && !service.getValue(parentMenu, 'hasChild', false))
            ? allMenu.filter(item => item.parent === service.getValue(currentMenu, 'parent'))
            : [];

        if(!subMenu.length){
            return null;
        }
        return(
            <Sticky topOffset={1}>
                {({style}) => {
                    const newStyle = {
                        ...style,
                        top: 80,
                    }
                    return (
                        <div className="local-navigation-wrap" style={{...newStyle, zIndex : 1}}>
                            <LocalNavigationBar {...this.props} subMenu={subMenu} />
                        </div>
                    )
                }}
            </Sticky>
        )
    }

    render() {
        const { spinning } = this.props;

        return (
            <Spinner spinning={spinning} tip={'Loading...'} >
                <StickyContainer>
                    <Layout className="web-container">
                        <HeaderContainer {...this.props}/>
                        {this.renderSubMenu()}
                        <Content className="section">
                            <WrapperContainer />
                        </Content>

                        <FooterContainer />
                    </Layout>
                </StickyContainer>
            </Spinner>
        );
    }

}

export default connect(mapStateToProps, mapDispatchProps)(Web);
