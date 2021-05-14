import {fetchFeed} from '../actions/FeedActions';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {createPost} from '../actions/PostActions';
import communityApi from '../../services/CommunityApi';
import {handleError} from '../actions/common';

const communityAdapter = createEntityAdapter({
  selectId: (community) => community._id,
});

export const createCommunity = createAsyncThunk(
  'community/create',
  async (payload, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.create(payload);
      console.log('response after creating community', response);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (payload, {getState}) => {
      const authAccess = getState().authorization.isRegistered;
      return !!authAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const joinCommunity = createAsyncThunk(
  'community/join',
  async (communityId, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.join(communityId);
      console.log('response after joining community', response);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (payload, {getState}) => {
      const authAccess = getState().authorization.isRegistered;
      console.log('authAccess in join community', authAccess);
      return !!authAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const leaveCommunity = createAsyncThunk(
  'community/leave',
  async (communityId, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.leave(communityId);
      console.log('response after leaving community', response);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (payload, {getState}) => {
      const authAccess = getState().authorization.isRegistered;
      return !!authAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const slice = createSlice({
  name: 'community',
  initialState: communityAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [createPost.fulfilled]: (state, action) => {
      const newPostId = action.payload.newPostId;
      console.log('community slice create post', action.payload);
      const newPost = action.payload.normalizedPost.posts[newPostId];
      const newCommunityId = newPost.community;
      const newCommunity =
        action.payload.normalizedPost.communities[newCommunityId];
      communityAdapter.addOne(state, newCommunity);
    },
    [fetchFeed.fulfilled]: (state, action) => {
      const normalizedPosts = action.payload.normalizedPosts;
      const isFeedEmpty =
        normalizedPosts &&
        Object.keys(normalizedPosts).length === 0 &&
        normalizedPosts.constructor === Object;

      if (!isFeedEmpty) {
        communityAdapter.addMany(
          state,
          action.payload.normalizedPosts.communities,
        );
      }
    },
    [createCommunity.rejected]: handleError,
    [joinCommunity.rejected]: handleError,
  },
});

export const communities = slice.reducer;

export const {
  selectById: selectCommunityById,
  selectIds: selectCommunityIds,
  selectEntities: selectCommunityEntities,
  selectAll: selectAllCommunities,
  selectTotal: selectTotalCommunites,
} = communityAdapter.getSelectors((state) => state.communities);
