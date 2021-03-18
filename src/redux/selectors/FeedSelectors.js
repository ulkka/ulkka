import {selectFeedPostById} from '../reducers/FeedSlice';

export const getFeedPostIds = (state, screen) =>
  state.feed.screens[screen] === undefined
    ? []
    : state.feed.screens[screen].ids;

export const isComplete = (state, screen) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].complete;

export const isLoading = (state, screen) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].loading;

export const isNewPostAdded = (state, screen) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].newPostAdded;

export const getIsViewableSelector = () => (state, screen, id) =>
  selectFeedPostById(state.feed.screens[screen], id).isViewable;

export const getIsPausedSelector = () => (state, screen, id) =>
  selectFeedPostById(state.feed.screens[screen], id).paused;
