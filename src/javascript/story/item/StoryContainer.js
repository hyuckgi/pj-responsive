import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../../commons/configs';

import { Story } from './';

class StoryContainer extends React.Component {

    render() {
        return (
            <Switch>
                <Route exact path={path.item(path.storyList)} component={Story}/>
            </Switch>
        );
    }

}

export default StoryContainer;
