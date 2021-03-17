import {fetchFeed} from '../actions/FeedActions';
import {
  loadAuth,
  socialAuth,
  emailLinkAuth,
  registerUser,
  signout,
} from '../actions/AuthActions';
import {fetchComments} from '../actions/CommentActions';
import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

export const userAdapter = createEntityAdapter({
  selectId: (user) => user._id,
});

const addRegisteredUserToSlice = (state, action) => {
  const registeredUser = action.payload.registeredUser;
  userAdapter.upsertOne(state, registeredUser);
};

export const slice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
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
        userAdapter.upsertMany(state, action.payload.normalizedPosts.users);
      }
    },
    [fetchComments.fulfilled]: (state, action) => {
      if (action.payload.normalizedComments.users !== undefined) {
        userAdapter.upsertMany(state, action.payload.normalizedComments.users);
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
