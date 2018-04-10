import React from 'react';

import { DesktopLayout, MobileLayout } from './commons/components/response';

import Mobile from './Mobile';
import Web from './Web';

class App extends React.Component {
    render() {
        return (
            <div className="app-container">
                <DesktopLayout>
                    <Web />
                </DesktopLayout>
                <MobileLayout>
                    <Mobile />
                </MobileLayout>
            </div>
        );
    }

}

export default App;
