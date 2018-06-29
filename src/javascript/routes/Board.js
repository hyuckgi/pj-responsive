import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { BoardContainer } from '../board/components';

class Board extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.list(path.board)} component={BoardContainer} />
            </Switch>
        );
    }

}

export default Board;
