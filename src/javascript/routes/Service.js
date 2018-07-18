import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { ServiceContainer } from '../service/components';

class Service extends React.Component {

    render() {
        return (
            <div className="service-wrapper">
                <Switch>
                    <Route path={path.list(path.service)} component={ServiceContainer} />
                </Switch>
            </div>
        );
    }
}

export default Service;
