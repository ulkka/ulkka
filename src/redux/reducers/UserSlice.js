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
import {push} from '../../navigation/Ref';
import userApi from '../../services/UserApi';
import Snackbar from 'react-native-snackbar';
import {createCachedSelector} from 're-reselect';
import {handleError} from '../actions/common';

export const userAdapter = createEntityAdapter({
  selectId: user => user._id,
});

const addRegisteredUserToSlice = (state, action) => {
  const {registeredUser, isRegistered} = action.payload;
  isRegistered && userAdapter.upsertOne(state, registeredUser);
};

export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (id, {rejectWithValue}) => {
    try {
      const response = await userApi.user.getUserById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateBio = createAsyncThunk(
  'user/updateBio',
  async ({id, bio}, {rejectWithValue}) => {
    try {
      const response = await userApi.user.updateUserBio(id, bio);
      return {id, bio};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateDisplayname = createAsyncThunk(
  'user/updateDisplayname',
  async ({id, displayname}, {rejectWithValue}) => {
    try {
      const response = await userApi.user.updateUserDisplayname(
        id,
        displayname,
      );
      return {id, displayname};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const blockUser = createAsyncThunk(
  'user/block',
  async (userId, {rejectWithValue}) => {
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

export const searchUsersByName = createAsyncThunk(
  'user/searchUsersByName',
  async (text, {rejectWithValue}) => {
    try {
      const response = await userApi.user.searchByName(text);
      console.log('response', response, response.status, response.data);
      if (response.status == 200 && response.data) {
        const userId = response.data._id;
        push('UserDetail', {userId: userId});
      }
      return {response, text};
    } catch (error) {
      return rejectWithValue(error);
    }
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
    [updateBio.fulfilled]: (state, action) => {
      const {id, bio} = action.payload;
      userAdapter.updateOne(state, {
        id: id,
        changes: {
          bio: bio,
        },
      });
      Snackbar.show({
        text: 'Account description changed',
        duration: Snackbar.LENGTH_SHORT,
      });
    },
    [updateDisplayname.fulfilled]: (state, action) => {
      const {id, displayname} = action.payload;
      userAdapter.updateOne(state, {
        id: id,
        changes: {
          displayname: displayname,
        },
      });
      Snackbar.show({
        text: 'Display Name Changed',
        duration: Snackbar.LENGTH_SHORT,
      });
    },
    [searchUsersByName.fulfilled]: (state, action) => {
      const {response, text} = action.payload;
      if (response.data === null && response.status == 200) {
        Snackbar.show({
          text: 'User not found',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    [fetchUserById.rejected]: handleError,
    [blockUser.rejected]: handleError,
    [unblockUser.rejected]: handleError,
    [updateBio.rejected]: handleError,
    [updateDisplayname.rejected]: handleError,
  },
});

export const users = slice.reducer;

export const {
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectTotalUsers,
} = userAdapter.getSelectors(state => state.users);

export const getUserCreatedAt = (state, id) =>
  selectUserById(state, id)?.created_at;

export const getUserDisplayname = (state, id) =>
  selectUserById(state, id)?.displayname;
export const getUserBio = (state, id) => selectUserById(state, id)?.bio;

const getUserPostKarma = (state, id) => selectUserById(state, id)?.postKarma;
const getUserCommentKarma = (state, id) =>
  selectUserById(state, id)?.commentKarma;

export const getUserTotalKarma = createCachedSelector(
  getUserPostKarma,
  getUserCommentKarma,
  (postKarma, commentKarma) => postKarma + commentKarma,
)((state, id) => id);

export const searchUserDisplayname = (state, value) =>
  selectAllUsers(state).filter(user =>
    user.displayname.toLowerCase().includes(value),
  );
