import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';

export function resetState(state, type) {
  postAdapter.removeAll(state);
}

export const createPost = createAsyncThunk(
  'posts/create',
  async (payload, thunkAPI) => {
    let response = await postApi.post.create(payload);
    const normalized = normalize(response.data, post);
    return {
      normalizedPost: normalized.entities,
      newPostId: normalized.result,
    };
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
  async ({id, voteType}, thunkAPI) => {
    let response = await postApi.post.vote(id, voteType);
    return response;
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
