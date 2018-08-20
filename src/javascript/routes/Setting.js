import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { ProfileContainer } from '../setting/components';

class Setting extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.profile} component={ProfileContainer} />
            </Switch>
        );
    }

}

export default Setting;
