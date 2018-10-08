import React from 'react';
import { Sticky } from 'react-sticky';

import { service } from '../../../commons/configs';
import { SubHeader } from '../header';

class SubNavigation extends React.Component {

    renderNavBar(){
        const { currentMenu } = this.props;

        return(
            <Sticky topOffset={70}>
                {({style, isSticky}) => {
                    return(
                        <div style={{...style, zIndex: 100}} className={`sub-header-container ${isSticky ? 'navigations-sticky' : 'navigations-relative'}`}>
                            <SubHeader
                                title={service.getValue(currentMenu, 'name')}
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
            <div>
                {this.renderNavBar()}
                {children}
            </div>
        );
    }

}

export default SubNavigation;
