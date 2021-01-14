import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';

const postAdapter = createEntityAdapter({selectId: (post) => post._id});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  let response = await postApi.post.fetch();
  const normalized = normalize(response.data, [post]);
  return normalized.entities;
});

export const votePost = createAsyncThunk(
  'posts/vote',
  async ({id, voteType}) => {
    let response = await postApi.post.vote(id, voteType);
    return response;
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
    [fetchPosts.fulfilled]: (state, action) => {
      postAdapter.upsertMany(state, action.payload.posts);
    },
    [votePost.fulfilled]: (state, action) => {
      console.log('in votepost fulfilled - ', state, action);
      const id = action.payload.data._id;
      const post = state.entities[id];
      const currentVote = post.userVote;
      const newVote = action.payload.data.userVote;
      const diff = currentVote - newVote;

      console.log('in votePost', id, post, currentVote, diff);
      state.entities[id].userVote = newVote;
      state.entities[id].voteCount = state.entities[id].voteCount - diff;
    },
  },
});

export const postReducer = slice.reducer;

export const {
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
  selectAll: selectAllPosts,
  selectTotal: selectTotalPosts,
} = postAdapter.getSelectors((state) => state.postReducer);
