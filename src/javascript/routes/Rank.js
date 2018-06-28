import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { User, Sponsor } from '../rank';

class Rank extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.userRank} component={User} />
                <Route path={path.sponsorRank} component={Sponsor} />
            </Switch>
        );
    }

}

export default Rank;
