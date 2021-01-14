import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import authReducer from './AuthReducer';
import optionSheetReducer from './OptionSheetReducer';
import {postReducer} from './PostReducer';
import {userReducer} from './UserReducer';
import {comments} from './CommentSlice';
import {replies} from './ReplySlice';

import {communityReducer} from './CommunityReducer';

import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

const loggerMiddleware = createLogger();

const AppReducers = combineReducers({
  authReducer,
  optionSheetReducer,
  postReducer,
  userReducer,
  communityReducer,
  comments,
  replies,
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
