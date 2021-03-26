import {post} from '../schema/FeedSchema';
import {fetchPostById} from './PostActions';
//import {selectPostById} from '../selectors/PostSelectors';
import postApi from '../../services/PostApi';
import userApi from '../../services/UserApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const fetchFeed = createAsyncThunk(
  'feed/fetch',
  async (type, {getState}) => {
    const {page, limit} = getState().feed[type].metadata;
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

      const screen = getState().feed[type];
      const requestAccess =
        screen === undefined ? true : !screen.complete && !screen.loading;

      return authAccess && requestAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const refreshFeed = createAsyncThunk(
  'feed/refresh',
  async (type, {dispatch}) => {
    //state changes are done in refreshFeed.pending and refreshFeed.fulfilled in feed slice
    await dispatch(fetchFeed(type));
    return type;
  },
);

export const refreshPostDetail = createAsyncThunk(
  'feed/refreshPost',
  async ({type, postId}, {dispatch}) => {
    //state changes are done in refreshPostDetail.pending and refreshPostDetail.fulfilled in feed slice
    await dispatch(fetchPostById(postId));
    return type;
  },
);

export const initPostDetail = createAsyncThunk(
  'feed/initPost',
  async ({screenId, postId}) => {
    console.log('initialising post detail');
    return {screenId, postId};
  },
);
