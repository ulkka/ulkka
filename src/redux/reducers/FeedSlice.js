import {createSlice} from '@reduxjs/toolkit';
import {signout} from '../actions/AuthActions';
import {fetchFeed} from '../actions/FeedActions';

const initialState = {
  ids: [],
  metadata: {
    page: 0,
    total: -1,
    limit: 2,
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
        screen.ids = state.screens[type].ids.concat(postIds);
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
    [signout.fulfilled]: (state) => {
      //resetAllFeeds(state);
    },
    // [registerUser.fulfilled]: () => postAdapter.getInitialState(),
  },
});

export const feed = slice.reducer;
export const {resetFeed, initialiseFeed} = slice.actions;
