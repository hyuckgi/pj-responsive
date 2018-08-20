import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { HistoryList } from '../mypage/components';

class Story extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.myHistory} component={HistoryList} />
            </Switch>
        );
    }

}

export default Story;
