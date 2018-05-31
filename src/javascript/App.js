import React from 'react';
import { connect } from 'react-redux';

import { DesktopLayout, MobileLayout } from './commons/components/response';
import { code as action } from './redux/actions';

import Mobile from './Mobile';
import Web from './Web';

const mapStateToProps = ({ fetch, code }) => ({
    spinning : fetch.isFetching || fetch.isPosting || !code.isInitialized,
});

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
