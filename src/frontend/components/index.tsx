export { default as Layout } from 'frontend/components/layout/layout';
export { default as Body } from 'frontend/components/body/body';
export * from 'frontend/components/menu/subComponents';

export * from 'frontend/components/hoc';

import * as React from 'react';
import { Component } from 'react';
import { Provider } from 'react-redux';

import { Router, Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';

import { getStore } from 'frontend/infrastructure';
import Layout from 'frontend/components/layout/layout';

let store = getStore();
let history = createBrowserHistory();

export default class Root extends Component{
    render(){
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Route exact path="/" component={Layout} />
                </ConnectedRouter>
            </Provider>
        );
    }
}