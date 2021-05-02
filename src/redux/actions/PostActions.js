import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';

export function resetState(state, type) {
  postAdapter.removeAll(state);
}

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.post.fetchById(id);
      const normalized = normalize(response.data, post);
      return {
        posts: normalized.entities.posts,
        postId: normalized.result,
        users: normalized.entities.users,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      return authAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const createPost = createAsyncThunk(
  'posts/create',
  async (payload, {rejectWithValue}) => {
    try {
      let response = await postApi.post.create(payload);
      const normalized = normalize(response.data, post);
      return {
        normalizedPost: normalized.entities,
        newPostId: normalized.result,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (payload, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const votePost = createAsyncThunk(
  'posts/vote',
  async ({id, voteType}, {rejectWithValue}) => {
    try {
      let response = await postApi.post.vote(id, voteType);
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

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id, {rejectWithValue}) => {
    try {
      let response = await postApi.post.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const reportPost = createAsyncThunk(
  'posts/report',
  async ({id, option}, {rejectWithValue}) => {
    try {
      let response = await postApi.post.report(id, option);
      return {id, option};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);
