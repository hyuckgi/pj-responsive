import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { RankContainer } from '../rank';

class Rank extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.list(path.rank)} component={RankContainer} />
            </Switch>
        );
    }

}

export default Rank;
