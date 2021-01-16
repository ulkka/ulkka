import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import authReducer from './AuthReducer';
import optionSheetReducer from './OptionSheetReducer';
import {posts} from './PostSlice';
import {users} from './UserSlice';
import {comments} from './CommentSlice';
import {replies} from './ReplySlice';
import {authorization} from './AuthSlice';

import {communities} from './CommunitySlice';

import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

const loggerMiddleware = createLogger();

const AppReducers = combineReducers({
  authReducer,
  optionSheetReducer,
  posts,
  users,
  communities,
  comments,
  replies,
  authorization,
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
