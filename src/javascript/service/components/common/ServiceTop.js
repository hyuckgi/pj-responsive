import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { LocalNavigationBar } from '../../../layout/web';

import { service } from '../../../commons/configs';

const mapStateToProps = ({ fetch, code, router, layout }) => {
    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, []);

    const subMenu = allMenu.filter(item => item.parent ===  '4000000');
    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const currentMenu = allMenu.filter(item => item.link === currentPath).find(item => item);
    const parentMenu = subMenu.filter(item => item.id === currentMenu.parent).find(item => item)

    return{
        parentMenu,
        subMenu
    }
};

const mapDispatchProps = dispatch => ({

});


class ServiceTop extends React.Component {

    render() {
        const { parentMenu, subMenu } = this.props;

        return (
            <div className="service-wrapper-top">
                <div className="local-navigation-wrap">
                    <LocalNavigationBar subMenu={subMenu} currentMenu={parentMenu}/>
                </div>

            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ServiceTop));
