import {comment} from '../schema/CommentSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId) => {
    let response = await postApi.comment.fetch(postId);
    const normalized = normalize(response.data, [comment]);
    return {
      normalizedComments: normalized.entities,
      parentComments: normalized.result,
    };
  },
  {
    condition: (postId, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const postComments = getState().comments.posts[postId];
      const requestAccess =
        postComments === undefined ? true : !postComments.loading;

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
