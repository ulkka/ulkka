import postApi from '../../services/PostApi';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

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
  {
    condition: ({postId, commentId}, {getState}) => {
      if (commentId != undefined) {
        const authStatus = getState().authorization.status;
        const access = authStatus == 'AUTHENTICATED' ? true : false;
        return access;
      }
      return true;
    },
    dispatchConditionRejection: true,
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
  {
    condition: ({id, voteType}, {getState}) => {
      const authStatus = getState().authorization.status;
      const access = authStatus == 'AUTHENTICATED' ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const activate = createAsyncThunk(
  'replies/activate',
  async () => {
    return true;
  },
  {
    condition: (arg, {getState}) => {
      const authStatus = getState().authorization.status;
      const access = authStatus == 'AUTHENTICATED' ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
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
    deactivate: (state, action) => {
      state.active = false;
    },
  },
  extraReducers: {
    [activate.fulfilled]: (state, action) => {
      state.active = true;
    },
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

export const getCommentId = (state) => state.replies.comment_id;

export const isActive = (state) => state.replies.active;

export const isLoading = (state) => state.replies.loading;

export const getResetCommentToggle = (state) =>
  state.replies.resetCommentToggle;

export const replies = slice.reducer;

export const {deactivate} = slice.actions;
