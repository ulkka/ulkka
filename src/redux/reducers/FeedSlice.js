import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import {signout} from '../actions/AuthActions';
import {fetchFeed} from '../actions/FeedActions';
import {createPost} from '../actions/PostActions';

const feedAdapter = createEntityAdapter({
  selectId: (post) => post._id,
});

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
  initialised: false,
};

const intialEntityState = (postId, screen) => {
  return {
    _id: postId,
    loaded: false,
    isViewable: screen == 'PostDetail' ? true : false,
    paused: true,
    error: false,
  };
};

export const slice = createSlice({
  name: 'feed',
  initialState: {
    screens: {},
  },

  reducers: {
    initialiseFeed(state, action) {
      const type = action.payload;
      const screen = state.screens[type];
      if (!screen) {
        state.screens[type] = initialState;
      }
    },
    initialisePostDetail(state, action) {
      const screenId = action.payload;
      state.screens[screenId] = initialState;
    },
    populatePostDetail(state, action) {
      const {screenId, postId} = action.payload;
      const screen = state.screens[screenId];
      const postEntity = intialEntityState(postId, 'PostDetail');
      const post = feedAdapter.getSelectors().selectById(screen, postId);
      if (!post) {
        console.log('initialising postdetail');
        feedAdapter.addOne(state.screens[screenId], postEntity);
      }
    },
    removePostDetail(state, action) {
      const screenId = action.payload;
      delete state.screens[screenId];
    },
    removePostFromFeed(state, action) {
      const {postId, type} = action.payload;
      const screen = state.screens[type];
      const post = feedAdapter.getSelectors().selectById(screen, postId);
      if (post) {
        feedAdapter.removeOne(screen, postId);
      }
    },
    setError(state, action) {
      const {postId, type} = action.payload;
      const screen = state.screens[type];

      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          error: true,
        },
      });
    },
    removeFeed(state, action) {
      const type = action.payload;
      delete state.screens[type];
    },
    setViewableItems(state, action) {
      const {items, type} = action.payload;
      const screen = state.screens[type];

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
        updates.push({
          id: postId,
          changes: {isViewable: isViewable, paused: paused},
        });
      });

      feedAdapter.updateMany(screen, updates);
    },
    togglePause(state, action) {
      const {postId, type} = action.payload;
      const screen = state.screens[type];
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
      const screen = state.screens[type];
      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          paused: true,
        },
      });
    },
    setLoaded(state, action) {
      const {postId, type} = action.payload;
      const screen = state.screens[type];
      feedAdapter.updateOne(screen, {
        id: postId,
        changes: {
          loaded: true,
        },
      });
    },
  },

  extraReducers: {
    [fetchFeed.pending]: (state, action) => {
      const type = action.meta.arg;
      const screen = state.screens[type];
      screen.loading = true;
    },
    [fetchFeed.fulfilled]: (state, action) => {
      const type = action.payload.type;
      const screen = state.screens[type];
      const normalizedPosts = action.payload.normalizedPosts;

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
      } else {
        screen.complete = true;
      }
      feedAdapter.addMany(screen, posts);
      screen.loading = false;
      screen.initialised = true;
    },
    [fetchFeed.rejected]: (state, action) => {
      const type = action.meta.arg;
      const screen = state.screens[type];
      screen.loading = false;
    },
    [createPost.fulfilled]: (state, action) => {
      const newPostId = action.payload.newPostId;
      const homeScreen = state.screens['home'];
      const newPost = intialEntityState(newPostId);
      homeScreen.entities[newPostId] = newPost;
      homeScreen.ids.unshift(newPostId); // to bring the newly added post to the top of current users home feed
    },
    [signout.fulfilled]: (state) => {
      //resetAllFeeds(state);
    },
    // [registerUser.fulfilled]: () => postAdapter.getInitialState(),
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
} = slice.actions;

export const {
  selectById: selectFeedPostById,
  selectIds: selectFeedPostIds,
  selectEntities: selectFeedPostEntities,
  selectAll: selectAllPosts,
  selectTotal: selectTotalPosts,
} = feedAdapter.getSelectors((state) => state);
