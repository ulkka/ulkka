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

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  let response = await postApi.post.fetch();
  const normalized = normalize(response.data, [post]);
  return normalized.entities;
});

export const votePost = createAsyncThunk(
  'posts/vote',
  async ({id, voteType}, thunkAPI) => {
    let response = await postApi.post.vote(id, voteType);
    return response;
  },
  {
    condition: ({id, voteType}, {getState}) => {
      const authStatus = getState().authorization.status;
      const access = authStatus == 'AUTHENTICATED' ? true : false;
      console.log('access', access);
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
  },
  reducers: {},
  extraReducers: {
    [createReply.fulfilled]: (state, action) => {
      state.entities[action.payload.data.postId].commentCount += 1;
    },
    [fetchPosts.fulfilled]: (state, action) => {
      postAdapter.upsertMany(state, action.payload.posts);
    },
    [signout.fulfilled]: () => postAdapter.getInitialState(),
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
