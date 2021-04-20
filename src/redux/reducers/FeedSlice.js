import {createSlice} from '@reduxjs/toolkit';
import {
  fetchFeed,
  refreshFeed,
  refreshPostDetail,
  initPostDetail,
} from '../actions/FeedActions';
import {feedAdapter} from '../selectors/FeedSelectors';
import {createPost, deletePost} from '../actions/PostActions';
import analytics from '@react-native-firebase/analytics';
import {handleError} from '../actions/common';

const initialState = {
  ids: [],
  entities: {},
  metadata: {
    page: 0,
    total: -1,
    limit: 10,
  },
  complete: false,
  loading: false,
  refreshing: false,
};

const intialEntityState = (postId, screen) => {
  return {
    _id: postId,
    loaded: false,
    isViewable: screen == 'PostDetail' ? true : false,
    paused: true,
    error: false,
    showMore: false,
    textHidden: true,
  };
};

export const slice = createSlice({
  name: 'feed',
  initialState: {},
  reducers: {
    initialiseFeed(state, action) {
      const type = action.payload;
      const screen = state[type];
      if (!screen) {
        state[type] = initialState;
      }
    },
    removePostDetail(state, action) {
      const screenId = action.payload;
      delete state[screenId];
    },
    removePostFromFeed(state, action) {
      const {postId, type} = action.payload;
      const screen = state[type];
      const post = feedAdapter.getSelectors().selectById(screen, postId);
      if (post) {
        feedAdapter.removeOne(screen, postId);
      }
    },
    setError(state, action) {
      const {postId, type} = action.payload;
      const screen = state[type];

      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          error: true,
        },
      });
    },
    removeFeed(state, action) {
      const type = action.payload;
      delete state[type];
    },
    setViewableItems(state, action) {
      const {items, type} = action.payload;
      const screen = state[type];

      const {changed} = items;

      let updates = [];

      changed.map((item) => {
        const {key: postId, isViewable} = item;
        const post = feedAdapter.getSelectors().selectById(screen, postId);
        if (!post) {
          return;
        }
        const pauseStatus = post.paused;
        let paused = !isViewable ? true : pauseStatus; // pause video if not viewable but still playing
        paused != pauseStatus
          ? updates.push({
              id: postId,
              changes: {isViewable: isViewable, paused: paused},
            })
          : updates.push({
              id: postId,
              changes: {isViewable: isViewable},
            });
      });

      feedAdapter.updateMany(screen, updates);
    },
    togglePause(state, action) {
      const {postId, type} = action.payload;
      const screen = state[type];
      const paused = feedAdapter.getSelectors().selectById(screen, postId)
        .paused;
      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          paused: !paused,
        },
      });
    },
    pauseVideo(state, action) {
      const {postId, type} = action.payload;
      const screen = state[type];
      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          paused: true,
        },
      });
    },
    setLoaded(state, action) {
      const {postId, type} = action.payload;
      const screen = state[type];
      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          loaded: true,
        },
      });
    },
    setShowMore(state, action) {
      const {postId, type, value} = action.payload;
      const screen = state[type];
      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          showMore: value,
        },
      });
      analytics().logEvent('post_longtext');
    },
    setTextHidden(state, action) {
      const {postId, type, value} = action.payload;
      const screen = state[type];
      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          textHidden: value,
        },
      });
      analytics().logEvent('post_toggletexthidden', {
        value: value,
      });
    },
  },

  extraReducers: {
    [fetchFeed.pending]: (state, action) => {
      const type = action.meta.arg;
      const screen = state[type];
      screen.loading = true;
    },
    [fetchFeed.fulfilled]: (state, action) => {
      const type = action.payload.type;
      const screen = state[type];

      const normalizedPosts = action.payload.normalizedPosts;

      const page = action.payload?.metadata?.page;
      const total = page && action.payload.metadata.total;
      const limit = page && action.payload.metadata.limit;
      const isComplete = total <= limit * page;

      const isFeedEmpty =
        normalizedPosts &&
        Object.keys(normalizedPosts).length === 0 &&
        normalizedPosts.constructor === Object;

      let posts = {};
      if (!isFeedEmpty) {
        const postIds = action.payload.postIds;
        postIds.map((postId, index) => {
          if (screen.ids.includes(postId)) {
            console.log(
              'found duplicate id in feed array, so skipping',
              postId,
            );
          } else {
            posts[postId] = intialEntityState(postId, screen);
          }
        });
        screen.metadata = action.payload.metadata;
        screen.complete = isComplete;
      } else {
        screen.complete = true;
      }
      feedAdapter.upsertMany(screen, posts);
      screen.loading = false;
      screen.refreshing = false;
    },
    [fetchFeed.rejected]: (state, action) => {
      const type = action.meta.arg;
      const screen = state[type];
      screen.loading = false;
      screen.refreshing = false;
      const {name: errorName} = action.error;
      errorName != 'ConditionError' && handleError(state, action);
    },
    [refreshFeed.pending]: (state, action) => {
      const type = action.meta.arg;
      const screen = state[type];
      if (screen) {
        screen.refreshing = true;
        feedAdapter.removeAll(screen);
        screen.loading = false;
        screen.complete = false;
        screen.metadata = {
          page: 0,
          total: -1,
          limit: 10,
        };
      }
    },
    [refreshFeed.fulfilled]: (state, action) => {
      const type = action.payload;
      const screen = state[type];
      screen.refreshing = false;
    },
    [refreshFeed.rejected]: handleError,
    [refreshPostDetail.pending]: (state, action) => {
      const {type} = action.meta.arg;
      const screen = state[type];
      screen.refreshing = true;
    },
    [refreshPostDetail.fulfilled]: (state, action) => {
      const type = action.payload;
      const screen = state[type];
      screen.refreshing = false;
      analytics().logEvent('postdetail_refresh');
    },
    [refreshPostDetail.rejected]: handleError,
    [initPostDetail.pending]: (state, action) => {
      const {screenId} = action.meta.arg;
      state[screenId] = initialState;
    },
    [initPostDetail.fulfilled]: (state, action) => {
      const {screenId, postId} = action.payload;
      const postEntity = intialEntityState(postId, 'PostDetail');
      feedAdapter.addOne(state[screenId], postEntity);
    },
    [createPost.fulfilled]: (state, action) => {
      const newPostId = action.payload.newPostId;
      const homeScreen = state['home'];
      const newPost = intialEntityState(newPostId);
      homeScreen.entities[newPostId] = newPost;
      homeScreen.ids.unshift(newPostId); // to bring the newly added post to the top of current users home feed
    },
    [deletePost.fulfilled]: (state, action) => {
      const postId = action.payload;
      const screenList = state;
      for (var screen in screenList) {
        if (Object.prototype.hasOwnProperty.call(screenList, screen)) {
          const screenFeed = state[screen];
          const isPostDetail = screen.indexOf('PostDetail') == 0;
          !isPostDetail && feedAdapter.removeOne(screenFeed, postId);
        }
      }
    },
  },
});

export const feed = slice.reducer;
export const {
  setViewableItems,
  initialiseFeed,
  togglePause,
  pauseVideo,
  setLoaded,
  initialisePostDetail,
  removePostDetail,
  removePostFromFeed,
  setError,
  removeFeed,
  populatePostDetail,
  setShowMore,
  setTextHidden,
} = slice.actions;
