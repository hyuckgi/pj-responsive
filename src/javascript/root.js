import '../stylesheet/root.less';

import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import { Mobile, Desktop } from './commons/components/response';

import { createBrowserHistory } from 'history';
import * as reducers from './redux/reducers';

import registerServiceWorker from './registerServiceWorker';

import { Page404, Page500 } from './layout';

import App from './App';
import Web from './Web';

import { LocaleProvider as LocaleProviderDesktop } from 'antd';
import { addLocaleData, IntlProvider } from 'react-intl';
import { locale } from './locales';

import { LocaleProvider as LocaleProviderMobile } from 'antd-mobile';

const history = createBrowserHistory({});

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



const Root = () => {
    return (
        <div className="app">
            <Desktop>
                <LocaleProviderDesktop locale={lang.antd}>
                    <IntlProvider locale={lang.locale} messages={lang.messages}>
                        <Web />
                    </IntlProvider>
                </LocaleProviderDesktop>
            </Desktop>
            <Mobile>
                <LocaleProviderMobile locale={lang.locale === 'zh-Hans-CN' ? null : lang.antd }>
                    <IntlProvider locale={lang.locale} messages={lang.messages}>
                        <App />
                    </IntlProvider>
                </LocaleProviderMobile>
            </Mobile>
        </div>
    );
};


ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
