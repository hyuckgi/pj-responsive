import React from 'react';
import { StickyContainer } from 'react-sticky';

import { DesktopLayout, MobileLayout } from './commons/components/response';

import Mobile from './Mobile';
import Web from './Web';

class App extends React.Component {
    render() {
        return (
            <StickyContainer className="app-container" style={{minHeight : '100vh'}}>
                <DesktopLayout>
                    <Web {...this.props}/>
                </DesktopLayout>
                <MobileLayout>
                    <Mobile {...this.props}/>
                </MobileLayout>
            </StickyContainer>
        );
    }
}

export default App;
