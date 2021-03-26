import {createEntityAdapter} from '@reduxjs/toolkit';

export const feedAdapter = createEntityAdapter({
  selectId: (post) => post._id,
});

export const {
  selectById: selectFeedPostById,
  selectIds: selectFeedPostIds,
  selectEntities: selectFeedPostEntities,
  selectAll: selectAllPosts,
  selectTotal: selectTotalPosts,
} = feedAdapter.getSelectors((state) => state);

export const getFeedPostIds = (state, screen) =>
  state.feed[screen] ? selectFeedPostIds(state.feed[screen]) : [];

export const isFeedComplete = (state, screen) => state.feed[screen]?.complete;

export const isFeedRefreshing = (state, screen) =>
  state.feed[screen]?.refreshing;

export const getIsPostInFeedPaused = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.paused
    : true;

export const getIsPostInFeedLoaded = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.loaded
    : false;

export const getIsPostInFeedError = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.error
    : false;
