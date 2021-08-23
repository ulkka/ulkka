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
      return rejectWithValue(error);
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
  async (userId, {getState, rejectWithValue}) => {
    try {
      const {page, limit} = getState().comments.users[userId].metadata;
      const nextPage = page + 1;
      let response = await userApi.comment.fetchUserComments(
        userId,
        nextPage,
        limit,
      );
      const data = response.data.data;
      const normalized = normalize(data, [comment]);
      return {
        normalizedComments: normalized.entities,
        metadata: response.data.metadata[0],
        commentIds: normalized.result,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (userId, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const comments = getState().comments.users[userId];
      const requestAccess =
        comments === undefined ? true : !comments.complete && !comments.loading;

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
      return rejectWithValue(error);
    }
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

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.comment.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
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

export const removeComment = createAsyncThunk(
  'comments/remove',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.comment.remove(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const authStatus = getState().authorization.status;
      const access = authStatus == 'AUTHENTICATED' ? true : false;

      const postId = getState().comments.entities[id].post;
      const communityId = getState().posts.entities[postId]?.community;
      const role = getState().communities.entities[communityId]?.role;

      return access && role == 'admin';
    },
    dispatchConditionRejection: true,
  },
);

export const reportComment = createAsyncThunk(
  'comments/report',
  async ({id, option}, {rejectWithValue}) => {
    try {
      let response = await postApi.comment.report(id, option);
      return {id, option};
    } catch (error) {
      return rejectWithValue(error);
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
      return rejectWithValue(error);
    }
  },
);
