import {comment} from '../schema/CommentSchema';
import postApi from '../../services/PostApi';
import userApi from '../../services/UserApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, {rejectWithValue}) => {
    try {
      let response = await postApi.comment.fetch(postId);

      const data = response.data;
      const normalized = normalize(data, [comment]);
      return {
        normalizedComments: normalized.entities,
        parentComments: normalized.result,
      };
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
  {
    condition: (postId, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const comments = getState().comments.posts[postId];
      const requestAccess = comments === undefined ? true : !comments.loading;

      return authAccess && requestAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const fetchUserComments = createAsyncThunk(
  'comments/fetchUserComments',
  async (userId, {rejectWithValue}) => {
    try {
      let response = await userApi.comment.fetchUserComments(userId, 1, 99);
      const data = response.data.data;
      const normalized = normalize(data, [comment]);
      return {
        normalizedComments: normalized.entities,
        parentComments: normalized.result,
      };
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
  {
    condition: (userId, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const comments = getState().comments.users[userId];
      const requestAccess = comments === undefined ? true : !comments.loading;

      return authAccess && requestAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const voteComment = createAsyncThunk(
  'comments/vote',
  async ({id, voteType}, {rejectWithValue}) => {
    try {
      let response = await postApi.comment.vote(id, voteType);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response);
    }
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

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.comment.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
  {
    condition: (id, {getState}) => {
      const authStatus = getState().authorization.status;
      const access = authStatus == 'AUTHENTICATED' ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const reportComment = createAsyncThunk(
  'comments/report',
  async ({id, option}, {rejectWithValue}) => {
    try {
      let response = await postApi.comment.report(id, option);
      return id;
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
  {
    condition: (id, {getState}) => {
      const authStatus = getState().authorization.status;
      const access = authStatus == 'AUTHENTICATED' ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const refreshComments = createAsyncThunk(
  'comments/refresh',
  async (postId, {dispatch, rejectWithValue}) => {
    try {
      await dispatch(fetchComments(postId));
      return postId;
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
);
