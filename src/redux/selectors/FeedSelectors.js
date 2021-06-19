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

export const getFeedSortMethod = (state, screen) => state.feed[screen]?.sort;

export const getFeedTopSortFrom = (state, screen) => state.feed[screen]?.from;

export const isFeedRefreshing = (state, screen) =>
  state.feed[screen]?.refreshing;

export const isFeedLoading = (state, screen) => state.feed[screen]?.loading;

export const getIsPostInFeedPaused = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.paused
    : true;

export const getIsPostInFeedIsViewable = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.isViewable
    : false;

export const getIsPostInFeedLoaded = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.loaded
    : false;

export const getIsPostInFeedError = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.error
    : false;

export const getPostTextShowMore = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.showMore
    : false;

export const getPostTextHidden = (state, screen, id) =>
  state.feed[screen]
    ? selectFeedPostById(state.feed[screen], id)?.textHidden
    : true;
