import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import {post} from '../schema/FeedSchema';

export const prepareReply = createAsyncThunk(
  'replies/prepare',
  async (data, thunkAPI) => {
    var res = {};
    if (data.postId != undefined) {
      res.type = 'post';
      res.id = data.postId;
    }
    if (data.commentId != undefined) {
      res.type = 'comment';
      res.id = data.commentId;
    }
    return res;
  },
);

export const createReply = createAsyncThunk(
  'replies/create',
  async (data, thunkAPI) => {
    const response = await postApi.comment.create(
      data.comment,
      data.postId,
      data.parentCommentId,
    );
    return {data: data, response: response};
  },
);

export const slice = createSlice({
  name: 'replies',
  initialState: {
    reply_to: 'post',
    post_id: null,
    comment_id: null,
    active: false,
    loading: false,
    resetCommentToggle: false,
  },
  reducers: {
    activate: (state, action) => {
      state.active = true;
    },
    deactivate: (state, action) => {
      state.active = false;
    },
  },
  extraReducers: {
    [prepareReply.fulfilled]: (state, action) => {
      const reply_to = action.payload.type;
      state.reply_to = reply_to;
      switch (reply_to) {
        case 'post':
          state.comment_id = null;
          state.post_id = action.payload.id;
          return;
        case 'comment':
          state.comment_id = action.payload.id;
          return;
      }
    },
    [createReply.pending]: (state, action) => {
      state.loading = true;
    },
    [createReply.fulfilled]: (state, action) => {
      state.active = false;
      state.loading = false;
      state.resetCommentToggle = !state.resetCommentToggle;
    },
    [createReply.rejected]: (state, action) => {
      state.active = false;
      state.loading = false;
    },
  },
});

export function getCommentId(state) {
  return state.replies.comment_id;
}
export function isActive(state) {
  return state.replies.active;
}
export function isLoading(state) {
  return state.replies.loading;
}

export function getResetCommentToggle(state) {
  return state.replies.resetCommentToggle;
}

export const replies = slice.reducer;

export const {activate, deactivate} = slice.actions;
