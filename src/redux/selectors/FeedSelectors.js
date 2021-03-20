import {createSelector} from 'reselect';
import {selectFeedPostById, selectFeedPostIds} from '../reducers/FeedSlice';

//export const getFeedPostIds =()=> (state, screen) =>
// state.feed.screens[screen]?.ids;
export const getFeed = () => (state, screen) => state.feed.screens[screen];

export const getFeedPostIds = () => (state, screen) =>
  selectFeedPostIds(state.feed.screens[screen]);

export const isCompleteSelector = () => (state, screen) =>
  state.feed.screens[screen]?.complete;

export const isLoadingSelector = () => (state, screen) =>
  state.feed.screens[screen]?.loading;

export const getIsPausedSelector = () => (screen, id) => {
  return createSelector(
    (state) => selectFeedPostById(state.feed.screens[screen], id),
    (post) => post.paused,
  );
};

export const getIsLoadedSelector = () => (screen, id) => {
  return createSelector(
    (state) => selectFeedPostById(state.feed.screens[screen], id),
    (post) => post.loaded,
  );
};

export const getIsErrorSelector = () => (screen, id) => {
  return createSelector(
    (state) => selectFeedPostById(state.feed.screens[screen], id),
    (post) => post.error,
  );
};
