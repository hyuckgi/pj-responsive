import '../stylesheet/root.less';
import React from 'react';
import UAParser from 'ua-parser-js';
import ReactDOM from 'react-dom';

import { Route, Switch } from 'react-router-dom';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { ConnectedRouter as Router, routerReducer, routerMiddleware } from 'react-router-redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import { MainContainer } from './main/web';

import { createBrowserHistory } from 'history';
import * as reducers from './redux/reducers';

import { Page404, Page500 } from './layout';

import { LocaleProvider as LocaleProviderDesktop } from 'antd';
import { addLocaleData, IntlProvider } from 'react-intl';
import { locale } from './locales';

import registerServiceWorker from './registerServiceWorker';

import { DesktopLayout, MobileLayout } from './commons/components/response';
import App from './App';

import { LocaleProvider as LocaleProviderMobile } from 'antd-mobile';

const parser = new UAParser();
const history = createBrowserHistory({forceRefresh: true});

const middleware = routerMiddleware(history);
const loggerMiddleware = createLogger({
    collapsed: (getState, action, logEntry) => true
});

const store = createStore(
    combineReducers({
        ...reducers,
        router: routerReducer
    }),
    applyMiddleware(
        middleware,
        thunkMiddleware,
        loggerMiddleware
    )
);

const lang = locale.init('en-US');

addLocaleData(lang.data);

const Inner = () => {
    return(
        <IntlProvider locale={lang.locale} messages={lang.messages}>
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        <Route exact path="/404" name="Page 404" component={Page404}/>
                        <Route exact path="/500" name="Page 500" component={Page500}/>
                        <Route path='/' name="main" component={App}/>
                    </Switch>
                </Router>
            </Provider>
        </IntlProvider>
    )
}

// const Provider = () => {
//     return(
//         <div className="provider">
//             <DesktopLayout>
//                 <LocaleProviderDesktop locale={lang.antd}></LocaleProviderDesktop>
//             </DesktopLayout>
//             <MobileLayout>
//                 <LocaleProviderMobile locale={lang.locale === 'zh-Hans-CN' ? null : lang.antd }>
//                     {Inner()}
//                 </LocaleProviderMobile>
//             </MobileLayout>
//         </div>
//     )
// }

const Root = () => {
    return (
        <div className="container">
            <DesktopLayout>
                <LocaleProviderDesktop locale={lang.antd}>
                    {Inner()}
                </LocaleProviderDesktop>
            </DesktopLayout>
            <MobileLayout>
                <LocaleProviderMobile locale={lang.locale === 'zh-Hans-CN' ? null : lang.antd }>
                    {Inner()}
                </LocaleProviderMobile>
            </MobileLayout>
        </div>
    );
};


ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
