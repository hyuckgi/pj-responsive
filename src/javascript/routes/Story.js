import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { path } from '../commons/configs';
import { StoryListContainer } from '../story';

class Story extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.story}  render={() => {
                    return <Redirect to={path.list(path.storyList)} />
                }}/>
                <Route path={path.list(path.storyList)} component={StoryListContainer} />
            </Switch>
        );
    }

}

export default Story;
