import React from 'react';
import { Sticky } from 'react-sticky';

import { service } from '../../../commons/configs';
import { SubHeader } from '../header';

class SubHeaderContainer extends React.Component {

    renderNavBar(){
        const { currentMenu, currentPath } = this.props;
        const title = currentPath.includes('/story/item/detail/') ? 'detail' : service.getValue(currentMenu, 'name', '');

        return(
            <Sticky topOffset={70}>
                {({style, isSticky}) => {
                    return(
                        <div style={{...style, zIndex: 100}} className={`sub-header-container ${isSticky ? 'navigations-sticky' : 'navigations-relative'}`}>
                            <SubHeader
                                title={title}
                                {...this.props}
                            />
                        </div>
                    );
                }}
            </Sticky>
        );
    }

    render() {
        const { children } = this.props;

        return (
            <div className="header-container">
                {this.renderNavBar()}
                {children}
            </div>
        );
    }

}

export default SubHeaderContainer;
