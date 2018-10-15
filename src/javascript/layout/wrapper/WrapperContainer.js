import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { path } from '../../commons/configs';
import { Main, Story, Rank, Board, Service, Mypage, Search, Setting } from '../../routes';
import { Join, Login, Page404, Page500 } from '../';

class WrapperContainer extends React.Component {

    constructor(props) {
        super(props);

        this.onRedirect = this.onRedirect.bind(this);
    }

    onRedirect(props){
        return <Redirect to={path.main} />
    }

    render() {
        return (
            <Switch>
                <Route exact path={path.home} render={this.onRedirect} />
                <Route exact path={path.notFound} name="notFound" component={Page404}/>
                <Route exact path={path.serverError} name="serverError" component={Page500}/>
                <Route exact path={path.join} name="Join Page" component={Join}/>
                <Route exact path={path.login} name="Login Page" component={Login}/>
                <Route exact path={path.search} component={Search} />
                <Route path={path.main} component={Main} />
                <Route path={path.story} component={Story} />
                <Route path={path.rank} component={Rank} />
                <Route path={path.board} component={Board} />
                <Route path={path.service} component={Service} />
                <Route path={path.mypage} component={Mypage} />
                <Route path={path.setting} component={Setting} />
            </Switch>
        );
    }

}

export default WrapperContainer;
