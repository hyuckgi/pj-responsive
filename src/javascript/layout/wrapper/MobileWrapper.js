import React from 'react';

import { GlobalNavigation, SubNavigation } from '../mobile';

class MobileWrapper extends React.Component {

    render() {
        const { isGlobalMenu } = this.props;

        return (
            <div className="wrapper-container">
                {isGlobalMenu ? (<GlobalNavigation {...this.props}/>) : (<SubNavigation {...this.props} />)}
            </div>
        );
    }

}

export default MobileWrapper;
