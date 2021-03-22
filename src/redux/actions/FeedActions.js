import {post} from '../schema/FeedSchema';
import postApi from '../../services/PostApi';
import userApi from '../../services/UserApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (type, {getState}) => {
    const {page, limit} = getState().feed.screens[type].metadata;
    const nextPage = page + 1;

    const isUserDetail = type.includes('UserDetail') ? true : false;
    const userId =
      isUserDetail &&
      type.substring(type.indexOf('-') + 1, type.lastIndexOf('-'));

    let response = isUserDetail
      ? await userApi.post.fetchUserPosts(userId, nextPage, limit)
      : await postApi.post.fetch(nextPage, limit);
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
