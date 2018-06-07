import React from 'react';
import { connect } from 'react-redux';

import { DesktopLayout, MobileLayout } from './commons/components/response';
import { code as action } from './redux/actions';

import Mobile from './Mobile';
import Web from './Web';

import { service } from './commons/configs';

const mapStateToProps = ({ fetch, code, router, layout }) => {
    const spinning = fetch.isFetching || fetch.isPosting || !code.isInitialized;

    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, []);
    const globalMenu = service.getValue(layout, 'list', []).filter(item => item.level === 0);
    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const currentMenu = allMenu.filter(item => item.link === currentPath).find(item => item);

    return{
        spinning,
        globalMenu,
        currentMenu,
        allMenu
    }
};

const mapDispatchProps = dispatch => ({
    initialize: () => dispatch(action.tag()),
});


class App extends React.Component {

    componentDidMount() {
        this.props.initialize();
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

export default connect(mapStateToProps, mapDispatchProps)(App);
