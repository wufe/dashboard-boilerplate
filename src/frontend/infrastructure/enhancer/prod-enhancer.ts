import { applyMiddleware, compose } from 'redux';
import { SagaMiddleware } from 'redux-saga';

export default (sagaMiddleware: SagaMiddleware<any>) => {
    return compose(
        applyMiddleware(sagaMiddleware)
    );
};

