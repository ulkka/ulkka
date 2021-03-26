import {comment} from '../schema/CommentSchema';
import postApi from '../../services/PostApi';
import userApi from '../../services/UserApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({postId, userId}) => {
    const entity = postId ? 'posts' : 'users';
    const entityId = entity == 'posts' ? postId : userId;

    let response =
      entity == 'posts'
        ? await postApi.comment.fetch(entityId)
        : await userApi.comment.fetchUserComments(entityId, 1, 100);
    const data = entity == 'posts' ? response.data : response.data.data;
    const normalized = normalize(data, [comment]);
    return {
      normalizedComments: normalized.entities,
      parentComments: normalized.result,
    };
  },
  {
    condition: ({postId, userId}, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const entity = postId ? 'posts' : 'users';
      const entityId = entity == 'posts' ? postId : userId;

      const comments = getState().comments[entity][entityId];
      const requestAccess = comments === undefined ? true : !comments.loading;

      return authAccess && requestAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const voteComment = createAsyncThunk(
  'comments/vote',
  async ({id, voteType}) => {
    let response = await postApi.comment.vote(id, voteType);
    return response;
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
  async (id) => {
    let response = await postApi.comment.delete(id);
    return id;
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
  async (postId, {dispatch}) => {
    await dispatch(fetchComments({postId: postId}));
    return postId;
  },
);
