import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { SearchContainer, Result } from '../search/components';

class Setting extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.search} component={SearchContainer} />
                <Route exact path={path.result} component={Result} />
            </Switch>
        );
    }

}

export default Setting;
