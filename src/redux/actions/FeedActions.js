import {post} from '../schema/FeedSchema';
import {fetchPostById} from './PostActions';
import feedApi from '../../services/FeedApi';
import {normalize} from 'normalizr';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {getTimestampFromRange} from '../../components/helpers';

const getFeedType = type => {
  if (type.includes('CommunityDetail')) {
    return 'CommunityDetail';
  }
  if (type.includes('UserDetail')) {
    return 'UserDetail';
  }
  if (type == 'home' || type == 'popular') {
    return 'main';
  }
};

const getFeedBasedOnType = async (getState, type) => {
  const {page, limit} = getState().feed[type].metadata;
  const {sort, from} = getState().feed[type];
  const fromTime = getTimestampFromRange(from);
  const nextPage = page + 1;
  const feedType = getFeedType(type);
  let response = {};
  switch (feedType) {
    case 'main':
      response = await feedApi.main.fetch(
        type,
        nextPage,
        limit,
        sort,
        fromTime,
      );
      return response;
    case 'UserDetail':
      const userId = type.substring(
        type.indexOf('-') + 1,
        type.lastIndexOf('-'),
      );
      response = await feedApi.user.fetch(
        userId,
        nextPage,
        limit,
        sort,
        fromTime,
      );
      return response;
    case 'CommunityDetail':
      const communityId = type.substring(
        type.indexOf('-') + 1,
        type.lastIndexOf('-'),
      );
      response = await feedApi.community.fetch(
        communityId,
        nextPage,
        limit,
        sort,
        fromTime,
      );
      return response;
  }
};

export const fetchFeed = createAsyncThunk(
  'feed/fetch',
  async (type, {getState, rejectWithValue}) => {
    try {
      let response = await getFeedBasedOnType(getState, type);
      const normalized = normalize(response.data.data, [post]);

      return {
        normalizedPosts: normalized.entities,
        metadata: response.data.metadata[0],
        type: type,
        postIds: normalized.result,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
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
  async (type, {dispatch, rejectWithValue}) => {
    try {
      //state changes are done in refreshFeed.pending and refreshFeed.fulfilled in feed slice
      await dispatch(fetchFeed(type));
      return type;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const sortFeed = createAsyncThunk(
  'feed/sort',
  async ({type, sort}, {dispatch, rejectWithValue}) => {
    try {
      //state changes are done in sortFeed.pending and sortFeed.fulfilled in feed slice
      await dispatch(refreshFeed(type));
      return type;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const refreshPostDetail = createAsyncThunk(
  'feed/refreshPost',
  async ({type, postId}, {dispatch, rejectWithValue}) => {
    try {
      //state changes are done in refreshPostDetail.pending and refreshPostDetail.fulfilled in feed slice
      await dispatch(fetchPostById(postId));
      return type;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const initPostDetail = createAsyncThunk(
  'feed/initPost',
  async ({screenId, postId}) => {
    return {screenId, postId};
  },
);
