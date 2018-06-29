import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { ProposeContainer, Story as StoryItem, StoryList } from '../story/components';

class Story extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.list(path.storyList)} component={StoryList} />
                <Route path={path.item(path.storyItem)} component={StoryItem} />
                <Route path={path.propose} component={ProposeContainer} />
            </Switch>
        );
    }

}

export default Story;
