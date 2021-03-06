import postApi from '../../services/PostApi';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import {fetchFeed} from './FeedSlice';
import {createReply} from './ReplySlice';
import {signout, socialAuth} from '../actions/AuthActions';

const postAdapter = createEntityAdapter({selectId: (post) => post._id});

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

function resetState(state, type) {
  postAdapter.removeAll(state);
}

export const slice = createSlice({
  name: 'posts',
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {},
  extraReducers: {
    [createReply.fulfilled]: (state, action) => {
      const postId = action.payload.data.postId;
      const post = postAdapter.getSelectors().selectById(state, postId);
      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          commentCount: post.commentCount + 1,
        },
      });
    },
    [fetchFeed.fulfilled]: (state, action) => {
      if (action.payload.normalizedPosts !== undefined) {
        const normalizedPosts = action.payload.normalizedPosts;

        const isFeedEmpty =
          normalizedPosts &&
          Object.keys(normalizedPosts).length === 0 &&
          normalizedPosts.constructor === Object;

        if (!isFeedEmpty) {
          const posts = normalizedPosts.posts;
          postAdapter.upsertMany(state, posts);
        }
      }
    },
    [signout.fulfilled]: (state) => {
      //resetAllFeeds(state);
    },
    // [registerUser.fulfilled]: () => postAdapter.getInitialState(),
    [votePost.fulfilled]: (state, action) => {
      const postId = action.payload.data._id;
      const post = postAdapter.getSelectors().selectById(state, postId);

      const currentUserVote = post.userVote;
      const newUserVote = action.payload.data.userVote;
      const diff = currentUserVote - newUserVote;
      const newVoteCount = post.voteCount - diff;

      postAdapter.updateOne(state, {
        id: postId,
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

export const getPostField = (id, field) =>
  createSelector(
    (state) => selectPostById(state, id),
    (post) => {
      return post[field];
    },
  );
