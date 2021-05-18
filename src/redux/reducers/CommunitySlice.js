import {fetchFeed} from '../actions/FeedActions';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {createPost, fetchPostById} from '../actions/PostActions';
import communityApi from '../../services/CommunityApi';
import {handleError} from '../actions/common';
import {
  loadAuth,
  socialAuth,
  emailLinkAuth,
  registerUser,
} from '../actions/AuthActions';
import Snackbar from 'react-native-snackbar';

const communityAdapter = createEntityAdapter({
  selectId: (community) => community._id,
});

export const createCommunity = createAsyncThunk(
  'community/create',
  async (payload, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.create(payload);
      return response.data;
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

export const fetchCommunityById = createAsyncThunk(
  'community/fetchById',
  async (communityId, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.fetchById(communityId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchTopCommunities = createAsyncThunk(
  'community/fetchTop',
  async (communityId, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.fetchTop(1, 10);
      console.log('response fetching top communities', response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const joinCommunity = createAsyncThunk(
  'community/join',
  async (communityId, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.join(communityId);
      return response.data.community;
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

export const leaveCommunity = createAsyncThunk(
  'community/leave',
  async (communityId, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.leave(communityId);
      console.log('response after leaving community', response);
      return communityId;
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

export const updateCommunityFields = createAsyncThunk(
  'community/field/update',
  async ({communityId, field, value}, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.updateField(
        communityId,
        field,
        value,
      );
      console.log('response after updating rules of community', response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: ({communityId, field, value}, {getState}) => {
      const authAccess = getState().authorization.isRegistered;
      const userRoleInCommunity = getState().communities.entities[communityId]
        .role;
      const isAdmin = userRoleInCommunity == 'admin';
      return authAccess && isAdmin;
    },
    dispatchConditionRejection: true,
  },
);

const addRegisteredUsersCommunities = (state, action) => {
  const registeredUser = action.payload.registeredUser;
  if (registeredUser) {
    const joinedCommunities = registeredUser.joinedCommunities;
    joinedCommunities.map((community, index) => {
      communityAdapter.addOne(state, {...community, role: 'member'});
    });

    const adminCommunities = registeredUser.adminCommunities;
    adminCommunities.map((community, index) => {
      communityAdapter.upsertOne(state, {...community, role: 'admin'});
    });
  }
};

export const slice = createSlice({
  name: 'community',
  initialState: communityAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchCommunityById.fulfilled]: (state, action) => {
      const community = action.payload;
      community && communityAdapter.upsertOne(state, community);
    },
    [fetchPostById.fulfilled]: (state, action) => {
      const {posts, postId, communities} = action.payload;
      const newCommunity = posts[postId].community;
      communityAdapter.addOne(state, communities[newCommunity]);
    },
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
    [fetchTopCommunities.fulfilled]: (state, action) => {
      const topCommunities = action.payload;
      communityAdapter.upsertMany(state, topCommunities);
    },
    [loadAuth.fulfilled]: addRegisteredUsersCommunities,
    [socialAuth.fulfilled]: addRegisteredUsersCommunities,
    [emailLinkAuth.fulfilled]: addRegisteredUsersCommunities,
    [registerUser.fulfilled]: addRegisteredUsersCommunities,
    [joinCommunity.fulfilled]: (state, action) => {
      const {_id: communityId, name} = action.payload;
      communityAdapter.updateOne(state, {
        id: communityId,
        changes: {role: 'member'},
      });
      Snackbar.show({text: 'Joined ' + name, duration: Snackbar.LENGTH_SHORT});
    },
    [leaveCommunity.fulfilled]: (state, action) => {
      const communityId = action.payload;
      communityAdapter.updateOne(state, {
        id: communityId,
        changes: {role: 'none'},
      });
    },
    [createCommunity.fulfilled]: (state, action) => {
      const community = action.payload;
      communityAdapter.addOne(state, {...community, role: 'admin'});
    },
    [updateCommunityFields.fulfilled]: (state, action) => {
      const {_id: communityId} = action.payload.data;
      const {field} = action.meta.arg;
      const value = action.payload.data[field];
      let changes = {};
      changes[field] = value;
      communityAdapter.updateOne(state, {
        id: communityId,
        changes: changes,
      });
      Snackbar.show({
        text: 'Community ' + field + ' updated',
        duration: Snackbar.LENGTH_SHORT,
      });
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

export const getIsCurrentUserPartOfAnyCommunity = (state) =>
  selectAllCommunities(state).find((community) => community.role == 'member');

export const getIsCurrentUserAdminOfAnyCommunity = (state) =>
  selectAllCommunities(state).find((community) => community.role == 'admin');

export const getUserMemberCommunities = (state) =>
  selectAllCommunities(state).filter(
    (community) => community.role != 'none' && community.role !== undefined,
  );

export const getUserNonMemberCommunities = (state) =>
  selectAllCommunities(state).filter(
    (community) => community.role == 'none' || community.role === undefined,
  );

export const getUserModeratorCommunities = (state) =>
  selectAllCommunities(state).filter((community) => community.role == 'admin');

export const getUserRoleInCommunity = (state, id) =>
  selectCommunityById(state, id)?.role;

export const getCommunityTitle = (state, id) =>
  id && selectCommunityById(state, id)?.name;

export const getIsCommunityRemoved = (state, id) =>
  id && selectCommunityById(state, id)?.isRemoved;

export const getCommunityDescription = (state, id) =>
  selectCommunityById(state, id)?.description;
export const getCommunityRules = (state, id) =>
  selectCommunityById(state, id)?.rules;
export const getCommunityField = (state, id, field) =>
  selectCommunityById(state, id)[field];
export const getCommunityIcon = (state, id) =>
  selectCommunityById(state, id)?.icon;
export const getCommunityModerators = (state, id) =>
  selectCommunityById(state, id)?.admins;
export const getCommunityMemberCount = (state, id) =>
  selectCommunityById(state, id)?.memberCount;
