import React from 'react';

import { DesktopLayout, MobileLayout } from './commons/components/response';

import Mobile from './Mobile';
import Web from './Web';

class App extends React.Component {
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

export default App;
