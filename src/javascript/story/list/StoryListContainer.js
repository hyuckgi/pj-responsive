import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../../commons/configs';

import { StoryList } from './';

class StoryListContainer extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.list(path.storyList)} component={StoryList}/>
            </Switch>
        );
    }
}

export default StoryListContainer;
