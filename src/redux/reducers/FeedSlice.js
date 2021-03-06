import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';
import {signout, socialAuth} from '../actions/AuthActions';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (type, {getState}) => {
    const {page, limit} = getState().feed.screens[type].metadata;
    const nextPage = page + 1;

    let response = await postApi.post.fetch(nextPage, limit);
    const normalized = normalize(response.data.data, [post]);

    return {
      normalizedPosts: normalized.entities,
      metadata: response.data.metadata[0],
      type: type,
      postIds: normalized.result,
    };
  },
  {
    condition: (type, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const screen = getState().feed.screens[type];
      const feedAccess =
        screen === undefined ? true : !screen.complete && !screen.loading;

      return authAccess && feedAccess;
    },
    dispatchConditionRejection: true,
  },
);

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

export const makeFeed = (screen) =>
  createSelector(
    (state) =>
      state.feed.screens[screen] === undefined
        ? []
        : state.feed.screens[screen].ids,
    (ids) => ids,
  );

export const isComplete = (screen) => (state) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].complete;

export const isLoading = (screen) => (state) =>
  state.feed.screens[screen] === undefined
    ? false
    : state.feed.screens[screen].loading;
