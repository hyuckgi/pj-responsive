import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { BoardListContainer, BoardItemContainer } from '../board/components';

class Board extends React.Component {

    render() {
        return (
            <Switch>
                <Route path={path.list(path.boardList)} component={BoardListContainer} />
                <Route path={path.item(path.boardItem)} component={BoardItemContainer} />
            </Switch>
        );
    }

}

export default Board;
