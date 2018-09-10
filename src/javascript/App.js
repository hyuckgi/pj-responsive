import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DesktopLayout, MobileLayout } from './commons/components';
import { code as action } from './redux/actions';
import { layout as layoutAction } from './redux/actions';

import Mobile from './Mobile';
import Web from './Web';

import { service } from './commons/configs';

const mapStateToProps = ({ fetch, code, router, layout, security }) => {
    const spinning = fetch.isFetching || fetch.isPosting || !code.isInitialized;

    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, []);
    const globalMenu = service.getValue(layout, 'list', []).filter(item => item.level === 0);
    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const currentMenu = allMenu.filter(item => item.link === currentPath).find(item => item);
    const userInfo = security || {};

    return{
        spinning,
        globalMenu,
        currentMenu,
        allMenu,
        userInfo
    }
};

const mapDispatchProps = dispatch => ({
    initialize: () => dispatch(action.tag()),
    layout : (role) => dispatch(layoutAction.layout(role))
});


class App extends React.Component {

    componentDidMount() {
        const role = service.getValue(this.props, 'userInfo.role', false);

        if(role){
            this.props.layout(role);
        }

        this.props.initialize();
    }

    componentDidUpdate(prevProps) {
        const token = service.getValue(this.props, 'userInfo.token', false);
        const role = service.getValue(this.props, 'userInfo.role', false);

        if(JSON.parse(JSON.stringify(prevProps.location)) !==  JSON.parse(JSON.stringify(this.props.location))){
            if(prevProps.location.pathname !== this.props.location.pathname){
                window.scrollTo(0, 0);
            }
        }

        if(service.getValue(prevProps, 'userInfo.token', false) !== token && role){
            this.props.layout(role);
        }
    }

    render() {
        return (
            <div className="app-container">
                <DesktopLayout>
                    <Web {...this.props}/>
                </DesktopLayout>
                <MobileLayout>
                    <Mobile {...this.props}/>
                </MobileLayout>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(App));
