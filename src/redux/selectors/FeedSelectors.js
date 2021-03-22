import {selectFeedPostById, selectFeedPostIds} from '../reducers/FeedSlice';

export const getFeedPostIds = (state, screen) =>
  selectFeedPostIds(state.feed.screens[screen]);

export const isFeedComplete = (state, screen) =>
  state.feed.screens[screen]?.complete;

export const getIsPostInFeedPaused = (state, screen, id) =>
  selectFeedPostById(state.feed.screens[screen], id).paused;

export const getIsPostInFeedLoaded = (state, screen, id) =>
  selectFeedPostById(state.feed.screens[screen], id).loaded;

export const getIsPostInFeedError = (state, screen, id) =>
  selectFeedPostById(state.feed.screens[screen], id).error;
