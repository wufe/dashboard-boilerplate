import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, compose } from 'redux';
import immutable from 'redux-immutable-state-invariant';
import logger from 'redux-logger';
import { SagaMiddleware } from 'redux-saga';

export default (sagaMiddleware: SagaMiddleware<any>) => {
    return composeWithDevTools({

    })(
        applyMiddleware(immutable(), logger, sagaMiddleware)
    );
};