import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { ProposeContainer, StoryContainer, StoryList, ReviewContainer } from '../story/components';

class Story extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.listStory(path.storyList)} component={StoryList} />
                <Route path={path.itemStory} component={StoryContainer} />
                <Route path={path.propose} component={ProposeContainer} />
                <Route path={path.item(path.review)} component={ReviewContainer} />
            </Switch>
        );
    }

}

export default Story;
