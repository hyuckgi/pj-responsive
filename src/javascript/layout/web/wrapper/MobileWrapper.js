import React from 'react';
import { connect } from 'react-redux';

import { service } from '../../../commons/configs';

import { GlobalNavigation, SubNavigation } from '../navigation';

const mapStateToProps = ({layout, router}) => {
    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, []);

    const globalMenu = service.getValue(layout, 'list', []).filter(item => item.level === 0);

    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const currentMenu = allMenu.filter(item => item.link.indexOf(currentPath.split("/")[1]) === 1).find(item => item);
    const isGlobalMenu = globalMenu.some(item => item.id === service.getValue(currentMenu, 'id', 0));
    const subMenu = isGlobalMenu && service.getValue(currentMenu, 'defaultLink', false)
        ? allMenu.filter(item => item.parent ===  currentMenu.id)
        : false;

    return {
        currentPath,
        globalMenu,
        currentMenu,
        isGlobalMenu,
        subMenu
    }
};

class WrapperContainer extends React.Component {

    render() {
        const { isGlobalMenu } = this.props;

        return (
            <div className="wrapper-container">
                {isGlobalMenu ? (<GlobalNavigation {...this.props}/>) : (<SubNavigation {...this.props} />)}
            </div>
        );
    }

}

export default connect(mapStateToProps)(WrapperContainer);
