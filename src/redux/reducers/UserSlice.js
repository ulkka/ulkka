import {fetchFeed} from '../actions/FeedActions';
import {
  loadAuth,
  socialAuth,
  emailLinkAuth,
  registerUser,
  signout,
} from '../actions/AuthActions';
import {fetchComments} from '../actions/CommentActions';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {createSelectorCreator, defaultMemoize} from 'reselect';
import userApi from '../../services/UserApi';
import {createCachedSelector} from 're-reselect';

export const userAdapter = createEntityAdapter({
  selectId: (user) => user._id,
});

const addRegisteredUserToSlice = (state, action) => {
  const registeredUser = action.payload.registeredUser;
  userAdapter.upsertOne(state, registeredUser);
};

export const fetchUserById = createAsyncThunk('user/fetchById', async (id) => {
  const response = await userApi.user.getUserById(id);
  return response.data[0];
});

export const slice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchUserById.fulfilled]: (state, action) => {
      const user = action.payload;
      userAdapter.upsertOne(state, user);
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

const createUserByIdEqualitySelector = createSelectorCreator(
  defaultMemoize,
  () => {
    return true;
  },
);

export const memoizedFlatUserByIdSelector = () =>
  createUserByIdEqualitySelector(selectUserById, (user) => user);

export const getUserCreatedAt = (state, id) =>
  selectUserById(state, id).created_at;

export const getUserDisplayname = (state, id) =>
  selectUserById(state, id).displayname;

const getUserPostKarma = (state, id) => selectUserById(state, id).postKarma;
const getUserCommentKarma = (state, id) =>
  selectUserById(state, id).commentKarma;

export const getUserTotalKarma = createCachedSelector(
  getUserPostKarma,
  getUserCommentKarma,
  (postKarma, commentKarma) => postKarma + commentKarma,
)((state, id) => id);
