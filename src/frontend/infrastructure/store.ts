import { rootReducer, rootSaga } from 'frontend/infrastructure';
import { State } from 'frontend/state';
import { Store, createStore, compose, applyMiddleware } from 'redux';
import Environment from 'frontend/environment';
import Enhancer from 'frontend/infrastructure/enhancer';
import saga from 'redux-saga';

const sagaMiddleware = saga();

let storeInstance: Store<State>;

export const makeStore: (preloadedState?: State) => Store<State> =
    (preloadedState) => {
        storeInstance = createStore(
            rootReducer,
            preloadedState || {},
            Enhancer(sagaMiddleware)
        );
        //sagaMiddleware.run(rootSaga);
        return storeInstance;
    };

export const getStore: () => Store<State> =
    () => storeInstance || makeStore();