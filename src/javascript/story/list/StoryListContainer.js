import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../configs';

import { Story, StoryList } from './';

class StoryListContainer extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.list('progress')} component={StoryList}/>
                <Route path={path.item()} component={Story}/>
            </Switch>
        );
    }

}

export default StoryListContainer;
