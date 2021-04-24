import {fetchFeed} from '../actions/FeedActions';
import {fetchPostById} from '../actions/PostActions';
import {
  loadAuth,
  socialAuth,
  emailLinkAuth,
  registerUser,
} from '../actions/AuthActions';
import {fetchComments} from '../actions/CommentActions';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import userApi from '../../services/UserApi';
import {createCachedSelector} from 're-reselect';
import {handleError} from '../actions/common';
import analytics from '@react-native-firebase/analytics';
import Snackbar from 'react-native-snackbar';

export const userAdapter = createEntityAdapter({
  selectId: (user) => user._id,
});

const getCurrentUserId = (state) => {
  const userIds = userAdapter.getSelectors().selectIds(state);
  const userId = userIds.find((userId, index) => {
    const user = userAdapter.getSelectors().selectById(state, userId);
    return user.currentUser;
  });
  return userId;
};

const removeItemAll = (arr, value) => {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
};

const addRegisteredUserToSlice = (state, action) => {
  const registeredUser = action.payload.registeredUser;
  registeredUser &&
    userAdapter.upsertOne(state, {...registeredUser, currentUser: true});
};

export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (id, {rejectWithValue}) => {
    try {
      const response = await userApi.user.getUserById(id);
      return response.data[0];
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const blockUser = createAsyncThunk(
  'user/block',
  async (userId, {rejectWithValue}) => {
    console.log('blocking user');
    try {
      await userApi.user.blockUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (userId, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const unblockUser = createAsyncThunk(
  'user/unblock',
  async (userId, {rejectWithValue}) => {
    console.log('blocking user');
    try {
      await userApi.user.unblockUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (userId, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const slice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchUserById.fulfilled]: (state, action) => {
      const user = action.payload;
      user && userAdapter.upsertOne(state, user);
    },
    [loadAuth.fulfilled]: addRegisteredUserToSlice,
    [socialAuth.fulfilled]: addRegisteredUserToSlice,
    [emailLinkAuth.fulfilled]: addRegisteredUserToSlice,
    [registerUser.fulfilled]: addRegisteredUserToSlice,
    [fetchFeed.fulfilled]: (state, action) => {
      const normalizedPosts = action.payload.normalizedPosts;

      const isFeedEmpty =
        normalizedPosts &&
        Object.keys(normalizedPosts).length === 0 &&
        normalizedPosts.constructor === Object;

      if (!isFeedEmpty) {
        userAdapter.addMany(state, action.payload.normalizedPosts.users);
      }
    },
    [fetchComments.fulfilled]: (state, action) => {
      if (action.payload.normalizedComments.users !== undefined) {
        userAdapter.addMany(state, action.payload.normalizedComments.users);
      }
    },
    [fetchPostById.fulfilled]: (state, action) => {
      const {posts, postId, users} = action.payload;
      const authorOfNewPost = posts[postId].author;
      userAdapter.upsertOne(state, users[authorOfNewPost]);
    },
    [blockUser.fulfilled]: (state, action) => {
      const blockedUserId = action.payload;
      const currentUserId = getCurrentUserId(state);
      const currentUserBlockedUsers =
        currentUserId &&
        userAdapter.getSelectors().selectById(state, currentUserId)
          ?.blockedUsers;
      userAdapter.removeOne(state, blockedUserId);
      userAdapter.updateOne(state, {
        id: currentUserId,
        changes: {
          blockedUsers: [...currentUserBlockedUsers, blockedUserId],
        },
      });
      Snackbar.show({
        text: 'User blocked',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('user_block');
    },
    [unblockUser.fulfilled]: (state, action) => {
      const blockedUserId = action.payload;
      const currentUserId = getCurrentUserId(state);
      const currentUserBlockedUsers =
        currentUserId &&
        userAdapter.getSelectors().selectById(state, currentUserId)
          ?.blockedUsers;
      userAdapter.updateOne(state, {
        id: currentUserId,
        changes: {
          blockedUsers: removeItemAll(
            [...currentUserBlockedUsers],
            blockedUserId,
          ),
        },
      });
      setTimeout(
        () =>
          Snackbar.show({
            text: 'Unblocked user',
            duration: Snackbar.LENGTH_SHORT,
          }),
        100,
      );
      analytics().logEvent('user_unblock');
    },
    [fetchUserById.rejected]: handleError,
    [blockUser.rejected]: handleError,
    [unblockUser.rejected]: handleError,
  },
});

export const users = slice.reducer;

export const {
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectTotalUsers,
} = userAdapter.getSelectors((state) => state.users);

export const getUserCreatedAt = (state, id) =>
  selectUserById(state, id)?.created_at;

export const getUserDisplayname = (state, id) =>
  selectUserById(state, id)?.displayname;

export const getUserBlockedUsers = (state, id) =>
  selectUserById(state, id)?.blockedUsers;

const getUserPostKarma = (state, id) => selectUserById(state, id)?.postKarma;
const getUserCommentKarma = (state, id) =>
  selectUserById(state, id)?.commentKarma;

export const getUserTotalKarma = createCachedSelector(
  getUserPostKarma,
  getUserCommentKarma,
  (postKarma, commentKarma) => postKarma + commentKarma,
)((state, id) => id);
