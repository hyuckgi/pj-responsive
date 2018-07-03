import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { RankListContainer, RankItemContainer } from '../rank/components';

class Rank extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.list(path.rankList)} component={RankListContainer} />
                <Route path={path.item(path.rankItem)} component={RankItemContainer} />
            </Switch>
        );
    }

}

export default Rank;
