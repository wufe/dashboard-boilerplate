import Environment from 'frontend/environment';
import saga from 'redux-saga';
import { applyMiddleware, compose } from 'redux';

const sagaMiddleware = saga();

const enhancer = Environment.isDevelopment() ?
    require('./dev-enhancer').default :
    require('./prod-enhancer').default;

export default enhancer;