import {fetchPosts} from './PostSlice';
import {fetchComments} from './CommentSlice';
import {createReply} from './ReplySlice';

import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

const userAdapter = createEntityAdapter({selectId: (user) => user.user_id});

export const slice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchPosts.fulfilled]: (state, action) => {
      userAdapter.upsertMany(state, action.payload.users);
    },
    [fetchComments.fulfilled]: (state, action) => {
      userAdapter.upsertMany(state, action.payload.normalizedComments.users);
    },
    [createReply.fulfilled]: (state, action) => {
      // userAdapter.upsertOne(state, action.payload.response.data.author);
    },
  },
});

export const users = slice.reducer;

export const {
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectTotalUsers,
} = userAdapter.getSelectors((state) => state.users);
