import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

import {posts} from './PostSlice';
import {users} from './UserSlice';
import {comments} from './CommentSlice';
import {commentWriter} from './CommentWriterSlice';
import {authorization} from './AuthSlice';
import {loadingOverlay} from './LoadingOverlaySlice';
import {optionSheet} from './OptionSheetSlice';
import {feed} from './FeedSlice';
//import {communities} from './CommunitySlice';

import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

const loggerMiddleware = createLogger();

const AppReducers = combineReducers({
  authorization,
  feed,
  posts,
  users,
  // communities,
  comments,
  commentWriter,
  optionSheet,
  loadingOverlay,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    thunkMiddleware, //loggerMiddleware
  ],
  //preloadedState,
});
/*let store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware),
  // applyMiddleware(thunkMiddleware),
);*/

export default store;
