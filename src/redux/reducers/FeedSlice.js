import {createSlice} from '@reduxjs/toolkit';
import {signout} from '../actions/AuthActions';
import {fetchFeed} from '../actions/FeedActions';
import {createPost} from '../actions/PostActions';

const initialState = {
  ids: [],
  metadata: {
    page: 0,
    total: -1,
    limit: 5,
  },
  complete: false,
  loading: false,
  initialised: false,
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
      if (screen === undefined) {
        state.screens[type] = initialState;
      }
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

      if (!isFeedEmpty) {
        const postIds = action.payload.postIds;
        postIds.map((postId, index) => {
          screen.ids.includes(postId)
            ? console.log(
                'found duplicate id in feed array, so skipping',
                postId,
              )
            : (screen.ids = state.screens[type].ids.concat(postId));
        });
        screen.metadata = action.payload.metadata;
      } else {
        screen.complete = true;
      }
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
      homeScreen.ids.unshift(newPostId);
    },
    [signout.fulfilled]: (state) => {
      //resetAllFeeds(state);
    },
    // [registerUser.fulfilled]: () => postAdapter.getInitialState(),
  },
});

export const feed = slice.reducer;
export const {resetFeed, initialiseFeed} = slice.actions;
