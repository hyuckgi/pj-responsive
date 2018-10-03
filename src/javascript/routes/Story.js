import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { ProposeContainer, StoryContainer, StoryList } from '../story/components';

class Story extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.list(path.storyList)} component={StoryList} />
                <Route path={path.itemStory} component={StoryContainer} />
                <Route path={path.propose} component={ProposeContainer} />
            </Switch>
        );
    }

}

export default Story;
