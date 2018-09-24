import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { SearchContainer } from '../search/components';

class Setting extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.search} component={SearchContainer} />
            </Switch>
        );
    }

}

export default Setting;
