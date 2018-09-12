import React from 'react';

import { service } from '../../commons/configs';
import { ServiceTop } from './';

class ServiceContainer extends React.Component {

    render() {
        const type = service.getValue(this.props, 'match.params.type', false);

        return (
            <div className="servie-container">
                <ServiceTop type={type} />
            </div>
        );
    }

}

export default ServiceContainer;
