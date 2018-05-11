import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { path } from '../commons/configs';
import { StoryListContainer } from '../story';

class Story extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.story}  render={() => {
                    return <Redirect to={path.list} />
                }}/>
                <Route path={path.list} component={StoryListContainer} />
            </Switch>
        );
    }

}

export default Story;
