import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { path } from '../commons/configs';
import { ListContainer, WithDrawal } from '../mypage/components';

class Mypage extends React.Component {

    render() {
        return (
            <div className="mypage-container">
                <Switch>
                    <Route path={path.list(path.mypageList)} component={ListContainer} />
                    <Route path={path.withdrawal} component={WithDrawal} />
                </Switch>
            </div>

        );
    }

}

export default Mypage;
