import {selectFeedPostById, selectFeedPostIds} from '../reducers/FeedSlice';

export const getFeedPostIds = (state, screen) =>
  state.feed.screens[screen]
    ? selectFeedPostIds(state.feed.screens[screen])
    : [];

export const isFeedComplete = (state, screen) =>
  state.feed.screens[screen]?.complete;

export const getIsPostInFeedPaused = (state, screen, id) =>
  state.feed.screens[screen]
    ? selectFeedPostById(state.feed.screens[screen], id)?.paused
    : true;

export const getIsPostInFeedLoaded = (state, screen, id) =>
  state.feed.screens[screen]
    ? selectFeedPostById(state.feed.screens[screen], id)?.loaded
    : false;

export const getIsPostInFeedError = (state, screen, id) =>
  state.feed.screens[screen]
    ? selectFeedPostById(state.feed.screens[screen], id)?.error
    : false;
