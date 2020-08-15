import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import appReducer from './reducers';

const store = createStore(appReducer);
export default store;