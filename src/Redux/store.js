import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import userReducer from './reducer';

const store = createStore(userReducer);

export default store;