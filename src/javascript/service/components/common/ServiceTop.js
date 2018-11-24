import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { service, values } from '../../../commons/configs';

const mapStateToProps = ({ router, layout }) => {
    const allMenu = Object.keys(layout).reduce((result, item) => {
        result = result.concat(layout[item]);
        return result;
    }, [])

    const currentPath = service.getValue(router, 'location.pathname', "/main");
    const currentMenu = allMenu.filter(item => item.link === currentPath).find(item => item);
    const parentMenu = allMenu.filter(item => item.id === currentMenu.parent).find(item => item);

    return{
        parentMenu,
    }
};

class ServiceTop extends React.Component {

    render() {
        const { parentMenu } = this.props;

        return (
            <div className="service-wrapper-top">
                <h2 className="title">{`${values.spoons.serviceName} ${parentMenu.name}`}</h2>
            </div>
        );
    }

}

export default withRouter(connect(mapStateToProps)(ServiceTop));
