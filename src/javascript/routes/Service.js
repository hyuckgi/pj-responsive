import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { CsContainer, RuleContainer } from '../service/components';

class Service extends React.Component {

    render() {
        return (
            <div className="service-wrapper">
                <Switch>
                    <Route path={path.cs} component={CsContainer} />
                    <Route path={path.rules} component={RuleContainer} />
                </Switch>
            </div>
        );
    }

}

export default Service;
