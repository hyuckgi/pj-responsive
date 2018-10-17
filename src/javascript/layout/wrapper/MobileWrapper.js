import React from 'react';

import { GlobalNavigation, SubHeaderContainer } from '../mobile';

class MobileWrapper extends React.Component {

    render() {
        const { isGlobalMenu = false, currentPath } = this.props;

        return (
            <div className="wrapper-container">
                {isGlobalMenu ? (<GlobalNavigation {...this.props}/>) : (<SubHeaderContainer {...this.props} />)}
            </div>
        );
    }

}

export default MobileWrapper;
