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
import analytics from '@react-native-firebase/analytics';
import {push} from '../../navigation/Ref';

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
      console.log('response fetching communityby id', response);
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

export const addAdmin = createAsyncThunk(
  'community/addAdmin',
  async ({communityId, user}, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.addAsAdmin(
        communityId,
        user._id,
      );
      return {communityId, user};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: ({communityId, user}, {getState}) => {
      const authAccess = getState().authorization.isRegistered;
      const userRoleInCommunity = getState().communities.entities[communityId]
        .role;
      const isAdmin = userRoleInCommunity == 'admin';
      return authAccess && isAdmin;
    },
    dispatchConditionRejection: true,
  },
);

export const dismissAdmin = createAsyncThunk(
  'community/dismissAdmin',
  async ({communityId, user}, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.dismissAsAdmin(
        communityId,
        user._id,
      );
      return {communityId, user};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: ({communityId, user}, {getState}) => {
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
  const {registeredUser, isRegistered} = action.payload;
  if (isRegistered) {
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

export const searchCommunitiesByName = createAsyncThunk(
  'community/searchCommunitiesByName',
  async (text, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.searchByName(text);
      console.log('response searching communitybyname', response);
      if (response.status == 200 && response.data) {
        const communityId = response.data._id;
        push('CommunityNavigation', {communityId: communityId});
      }
      return {response, text};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const toggleAdminNotifications = createAsyncThunk(
  'community/toggleAdminNotifications',
  async (communityId, {rejectWithValue}) => {
    try {
      const response = await communityApi.community.toggleAdminNotifications(
        communityId,
      );
      return communityId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (communityId, {getState}) => {
      const authAccess = getState().authorization.isRegistered;
      const userRoleInCommunity = getState().communities.entities[communityId]
        .role;
      const isAdmin = userRoleInCommunity == 'admin';
      return authAccess && isAdmin;
    },
    dispatchConditionRejection: true,
  },
);

export const slice = createSlice({
  name: 'community',
  initialState: communityAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchCommunityById.fulfilled]: (state, action) => {
      const community = action.payload;
      if (community) {
        const {_id: communityId, membership} = community;
        communityAdapter.upsertOne(state, community);
        if (membership) {
          const {isAdmin, isBanned} = membership;
          if (isAdmin)
            communityAdapter.updateOne(state, {
              id: communityId,
              changes: {
                role: 'admin',
              },
            });
          else if (isBanned)
            communityAdapter.updateOne(state, {
              id: communityId,
              changes: {
                role: 'banned',
              },
            });
          else
            communityAdapter.updateOne(state, {
              id: communityId,
              changes: {
                role: 'member',
              },
            });
        } else {
          communityAdapter.updateOne(state, {
            id: communityId,
            changes: {
              role: 'none',
            },
          });
        }
      }
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
      analytics().logEvent('community_join', {
        title: name,
      });
    },
    [leaveCommunity.fulfilled]: (state, action) => {
      const communityId = action.payload;
      communityAdapter.updateOne(state, {
        id: communityId,
        changes: {role: 'none'},
      });
      analytics().logEvent('community_leave', {
        item_id: communityId,
      });
    },
    [createCommunity.fulfilled]: (state, action) => {
      const community = action.payload;
      communityAdapter.addOne(state, {...community, role: 'admin'});
      analytics().logEvent('community_create', {
        type: community.name,
      });
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
      analytics().logEvent('community_update', {
        value: field,
      });
    },
    [addAdmin.fulfilled]: (state, action) => {
      const {communityId, user} = action.payload;
      const communityAdmins = communityAdapter
        .getSelectors()
        .selectById(state, communityId)?.admins;

      communityAdapter.updateOne(state, {
        id: communityId,
        changes: {
          admins: [...communityAdmins, user],
        },
      });
      Snackbar.show({
        text: user.displayname + ' added as admin',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('communityAdmin_add');
    },
    [dismissAdmin.fulfilled]: (state, action) => {
      const {communityId, user} = action.payload;
      const communityAdmins = communityAdapter
        .getSelectors()
        .selectById(state, communityId)?.admins;

      const newAdmins = communityAdmins.filter(
        (admin) => admin._id !== user._id,
      );
      communityAdapter.updateOne(state, {
        id: communityId,
        changes: {
          admins: newAdmins,
        },
      });
      Snackbar.show({
        text: 'User dismissed as admin',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('communityAdmin_dismiss');
    },
    [toggleAdminNotifications.pending]: (state, action) => {
      const communityId = action.meta.arg;
      const communityMembership = communityAdapter
        .getSelectors()
        .selectById(state, communityId)?.membership;
      communityAdapter.updateOne(state, {
        id: communityId,
        changes: {
          membership: {
            subscribeToAdminNotification: !communityMembership.subscribeToAdminNotification,
          },
        },
      });
      analytics().logEvent('communityAdminNotifications_toggle', {
        value: !communityMembership.subscribeToAdminNotification,
      });
    },
    [toggleAdminNotifications.rejected]: (state, action) => {
      const communityId = action.meta.arg;
      const communityMembership = communityAdapter
        .getSelectors()
        .selectById(state, communityId)?.membership;
      communityAdapter.updateOne(state, {
        id: communityId,
        changes: {
          membership: {
            subscribeToAdminNotification: !communityMembership.subscribeToAdminNotification,
          },
        },
      });
      Snackbar.show({
        text: 'Sorry, Please try again later',
        duration: Snackbar.LENGTH_SHORT,
      });
    },
    [createCommunity.rejected]: handleError,
    [joinCommunity.rejected]: handleError,
    [leaveCommunity.rejected]: handleError,
    [updateCommunityFields.rejected]: handleError,
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

export const searchCommunityTitle = (state, value) =>
  selectAllCommunities(state).filter((community) =>
    community.name.toLowerCase().includes(value),
  );

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
export const getIsUserAdminOfCommunity = (state, communityId, userId) =>
  selectCommunityById(state, communityId)?.admins?.find(
    (admin) => admin._id === userId,
  );
export const getIsUserSubscribedToAdminNotifications = (state, id) =>
  selectCommunityById(state, id)?.membership?.subscribeToAdminNotification;
