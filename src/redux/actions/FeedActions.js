import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (type, {getState}) => {
    const {page, limit} = getState().feed.screens[type].metadata;
    const nextPage = page + 1;

    let response = await postApi.post.fetch(nextPage, limit);
    const normalized = normalize(response.data.data, [post]);

    return {
      normalizedPosts: normalized.entities,
      metadata: response.data.metadata[0],
      type: type,
      postIds: normalized.result,
    };
  },
  {
    condition: (type, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const screen = getState().feed.screens[type];
      const requestAccess =
        screen === undefined ? true : !screen.complete && !screen.loading;

      return authAccess && requestAccess;
    },
    dispatchConditionRejection: true,
  },
);
