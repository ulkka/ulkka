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

      const complete =
        getState().feed.screens[type] == undefined
          ? false
          : getState().feed.screens[type].complete;
      const loading =
        getState().feed.screens[type] == undefined
          ? false
          : getState().feed.screens[type].loading;

      const feedAccess = !complete && !loading;
      return authAccess && feedAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const slice = createSlice({
  name: 'feed',
  initialState: {
    screens: {},
  },

  reducers: {
    initialiseFeed(state, action) {
      const type = action.payload;
      if (state.screens[type] === undefined) {
        state.screens[type] = {
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
      }
    },
  },

  extraReducers: {
    [fetchFeed.pending]: (state, action) => {
      const type = action.meta.arg;
      state.screens[type].loading = true;
    },
    [fetchFeed.fulfilled]: (state, action) => {
      const type = action.payload.type;
      state.screens[type].loading = false;

      if (action.payload.normalizedPosts !== undefined) {
        const postIds = action.payload.postIds;

        state.screens[type].ids = state.screens[type].ids.concat(postIds);
        state.screens[type].metadata = action.payload.metadata;
        const {page, total, limit} = action.payload.metadata;
        if (page * limit >= total) {
          state.screens[type].complete = true;
        }
      }

      state.screens[type].initialised = true;
    },
    [fetchFeed.rejected]: (state, action) => {
      const type = action.meta.arg;
      state.screens[type].loading = false;
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
