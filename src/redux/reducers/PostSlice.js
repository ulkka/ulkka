import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import {createReply} from '../reducers/ReplySlice';
import {signout, socialAuth} from '../actions/AuthActions';

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
      type: type,
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

function resetState(state) {
  postAdapter.removeAll(state);
  state.metadata = {
    page: 0,
    total: -1,
    limit: 10,
  };
  state.complete = false;
  state.loading = false;
}

export const slice = createSlice({
  name: 'posts',
  initialState: {
    ids: [],
    entities: {},
    metadata: {
      page: 0,
      total: -1,
      limit: 10,
    },
    complete: false,
    loading: false,
  },
  reducers: {
    resetFeed(state) {
      resetState(state);
    },
  },
  extraReducers: {
    [createReply.fulfilled]: (state, action) => {
      state.entities[action.payload.data.postId].commentCount += 1;
    },
    [fetchPosts.pending]: (state, action) => {
      state.loading = true;
      console.log('state, action fetchposts pending', state, action);
      state[action.meta.arg] = {
        ids: [],
        entities: {},
        metadata: {
          page: 0,
          total: -1,
          limit: 10,
        },
        complete: false,
        loading: false,
      };
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.normalizedPosts !== undefined) {
        postAdapter.upsertMany(state, action.payload.normalizedPosts.posts);

        postAdapter.upsertMany(
          state[action.payload.type],
          action.payload.normalizedPosts.posts,
        );
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
    [signout.fulfilled]: (state) => {
      resetState(state);
    },
    // [registerUser.fulfilled]: () => postAdapter.getInitialState(),
    [votePost.fulfilled]: (state, action) => {
      const id = action.payload.data._id;
      const post = state.entities[id];
      const currentUserVote = post.userVote;
      const newUserVote = action.payload.data.userVote;
      const diff = currentUserVote - newUserVote;
      const newVoteCount = state.entities[id].voteCount - diff;
      postAdapter.updateOne(state, {
        id: id,
        changes: {
          userVote: newUserVote,
          voteCount: newVoteCount,
        },
      });
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

export const getPostTitle = createSelector(
  selectPostById,
  (item) => item.title,
);

export const getPostVoteCount = createSelector(
  selectPostById,
  (item) => item.voteCount,
);

export const getPostUserVote = createSelector(
  selectPostById,
  (item) => item.userVote,
);

export const getPostCreatedAt = createSelector(
  selectPostById,
  (item) => item.created_at,
);

export const getPostCommunityId = createSelector(
  selectPostById,
  (item) => item.community,
);

export const getPostAuthorId = createSelector(
  selectPostById,
  (item) => item.author,
);

export const getPostType = createSelector(selectPostById, (item) => item.type);

export const getPostDescription = createSelector(
  selectPostById,
  (item) => item.description,
);

export const getPostMediaMetadata = createSelector(
  selectPostById,
  (item) => item.mediaMetadata,
);

export const getPostCommentCount = createSelector(
  selectPostById,
  (item) => item.commentCount,
);

export const isComplete = (state) => state.posts.complete;
export const isLoading = (state) => state.posts.loading;
export const {resetFeed} = slice.actions;
