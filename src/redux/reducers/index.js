import { combineReducers, createStore } from 'redux';

import authReducer from './AuthReducer';

const AppReducers = combineReducers({
    authReducer
});

const rootReducer = (state, action) => {
    return AppReducers(state, action);
};

let store = createStore(rootReducer);

export default store;