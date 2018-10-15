import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { SettingContainer } from '../setting/components';

class Setting extends React.Component {

    render() {
        return (
            <div className="setting-container">
                <Switch>
                    <Route path={path.list(path.setting)} component={SettingContainer} />
                </Switch>
            </div>

        );
    }

}

export default Setting;
