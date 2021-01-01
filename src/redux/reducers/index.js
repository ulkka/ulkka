import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import authReducer from './AuthReducer';
import CommentReducer from './CommentReducer';
import optionSheetReducer from './OptionSheetReducer';
import feedReducer from './FeedReducer';

import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

const loggerMiddleware = createLogger();

const AppReducers = combineReducers({
  authReducer,
  CommentReducer,
  optionSheetReducer,
  feedReducer,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunkMiddleware, loggerMiddleware],
  //preloadedState,
});
/*let store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  // applyMiddleware(thunkMiddleware),
);*/

export default store;
