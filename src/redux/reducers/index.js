import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import authReducer from './AuthReducer';
import CommentReducer from './CommentReducer';

const loggerMiddleware = createLogger();

const AppReducers = combineReducers({
  authReducer,
  CommentReducer,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
};

let store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware),
);

export default store;
