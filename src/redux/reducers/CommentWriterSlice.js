import postApi from '../../services/PostApi';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {normalize} from 'normalizr';
import {comment} from '../schema/CommentSchema';
import {handleError} from '../actions/common';

export const prepareReply = createAsyncThunk(
  'commentCreator/prepare',
  async (data, {rejectWithValue}) => {
    try {
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
    } catch (error) {
      return rejectWithValue(error);
    }
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
  'commentCreator/create',
  async (data, {rejectWithValue}) => {
    try {
      const response = await postApi.comment.create(
        data.comment,
        data.postId,
        data.parentCommentId,
      );
      const normalized = normalize(response.data, comment);
      return {
        data: data,
        response: response,
        normalizedComment: normalized.entities,
        result: normalized.result,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: ({postId, commentId}, {getState}) => {
      const authStatus = getState().authorization.status;
      const access = authStatus == 'AUTHENTICATED' ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const activate = createAsyncThunk(
  'commentCreator/activate',
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
  name: 'commentWriter',
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
    [activate.rejected]: handleError,
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
    [prepareReply.rejected]: handleError,
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
      handleError(state, action);
    },
  },
});

export const getCommentId = (state) => state.commentWriter.comment_id;

export const isActive = (state) => state.commentWriter.active;

export const isLoading = (state) => state.commentWriter.loading;

export const getResetCommentToggle = (state) =>
  state.commentWriter.resetCommentToggle;

export const commentWriter = slice.reducer;

export const {deactivate} = slice.actions;
