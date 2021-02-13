import {createSlice} from '@reduxjs/toolkit';
import {voteComment} from './CommentSlice';
import {votePost} from './PostSlice';
import {createReply, activate} from './ReplySlice';
import {
  signout,
  fulfillAuth,
  loadAuth,
  socialAuth,
  emailLinkAuth,
  registerUser,
  showAuthScreen,
} from '../actions/AuthActions';
import Snackbar from 'react-native-snackbar';

export const slice = createSlice({
  name: 'authorization',
  initialState: {
    status: 'UNAUTHENTICATED',
    user: null,
    idToken: null,
    isRegistered: 0,
  },
  reducers: {},
  extraReducers: {
    [registerUser.fulfilled]: (state, action) => {
      state.isRegistered = 1;
      Snackbar.show({
        text: 'Welcome!',
        duration: Snackbar.LENGTH_LONG,
      });
    },
    [socialAuth.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      const type = action.meta.arg;
      action.payload.isRegistered
        ? Snackbar.show({
            text: 'Welcome!',
            duration: Snackbar.LENGTH_SHORT,
          })
        : Snackbar.show({
            text: 'Successfully logged in with ' + type,
            duration: Snackbar.LENGTH_SHORT,
          });
    },
    [loadAuth.fulfilled]: fulfillAuth,
    [emailLinkAuth.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      Snackbar.show({
        text: 'Successfully logged in with Email',
        duration: Snackbar.LENGTH_SHORT,
      });
    },
    [signout.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
    },
    [votePost.rejected]: showAuthScreen,
    [voteComment.rejected]: showAuthScreen,
    [createReply.rejected]: showAuthScreen,
    [activate.rejected]: showAuthScreen,
  },
});

export const authorization = slice.reducer;
export const getAuthStatus = (state) => state.authorization.status;
export const getRegistrationStatus = (state) =>
  state.authorization.isRegistered;
