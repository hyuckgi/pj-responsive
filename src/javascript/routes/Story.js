import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { path } from '../commons/configs';
import { StoryListContainer, ProposeContainer } from '../story';

class Story extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.story}  render={() => {
                    return <Redirect to={path.storyList} />
                }}/>
                <Route path={path.storyList} component={StoryListContainer} />
                <Route path={path.propose} component={ProposeContainer} />
            </Switch>
        );
    }

}

export default Story;
