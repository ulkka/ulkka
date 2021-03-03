import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {createReply} from '../reducers/ReplySlice';
import {signout} from '../actions/AuthActions';

const postAdapter = createEntityAdapter({selectId: (post) => post._id});

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (type, {getState}) => {
    const {page, limit} = getState().posts.metadata;
    const nextPage = page + 1;
    let response = await postApi.post.fetch(nextPage, limit);
    const normalized = normalize(response.data.data, [post]);
    return {
      normalizedPosts: normalized.entities,
      metadata: response.data.metadata[0],
    };
  },
  {
    condition: (type, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const feedAccess =
        !getState().posts.complete && !getState().posts.loading;
      return authAccess && feedAccess;
    },
    dispatchConditionRejection: false,
  },
);

export const votePost = createAsyncThunk(
  'posts/vote',
  async ({id, voteType}, thunkAPI) => {
    let response = await postApi.post.vote(id, voteType);
    return response;
  },
  {
    condition: ({id, voteType}, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const slice = createSlice({
  name: 'posts',
  initialState: {
    ids: [],
    entities: {},
    metadata: {
      page: 0,
      total: -1,
      limit: 2,
    },
    complete: false,
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [createReply.fulfilled]: (state, action) => {
      state.entities[action.payload.data.postId].commentCount += 1;
    },
    [fetchPosts.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.normalizedPosts !== undefined) {
        postAdapter.upsertMany(state, action.payload.normalizedPosts.posts);
        state.metadata = action.payload.metadata;
        const {page, total, limit} = action.payload.metadata;
        if (page * limit >= total) {
          state.complete = true;
        }
      }
    },
    [fetchPosts.rejected]: (state, action) => {
      state.loading = false;
    },
    [signout.fulfilled]: (state, action) => {
      // set initial state on signout
      state.ids = [];
      state.entities = {};
      state.metadata = {
        page: 0,
        total: -1,
        limit: 2,
      };
      state.complete = false;
      state.loading = false;
    },
    // [socialAuth.fulfilled]: () => postAdapter.getInitialState(),
    // [registerUser.fulfilled]: () => postAdapter.getInitialState(),
    [votePost.fulfilled]: (state, action) => {
      const id = action.payload.data._id;
      const post = state.entities[id];
      const currentVote = post.userVote;
      const newVote = action.payload.data.userVote;
      const diff = currentVote - newVote;
      state.entities[id].userVote = newVote;
      state.entities[id].voteCount = state.entities[id].voteCount - diff;
    },
  },
});
export const posts = slice.reducer;

export const {
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
  selectAll: selectAllPosts,
  selectTotal: selectTotalPosts,
} = postAdapter.getSelectors((state) => state.posts);

export const isComplete = (state) => state.posts.complete;
export const isLoading = (state) => state.posts.loading;
