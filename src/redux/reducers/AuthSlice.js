import {createSlice} from '@reduxjs/toolkit';
import {voteComment} from './CommentSlice';
import {votePost} from './PostSlice';
import {createReply, activate, prepareReply} from './ReplySlice';
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
import {goBackFromAuthToHome} from '../../navigation/Ref';

export const slice = createSlice({
  name: 'authorization',
  initialState: {
    status: 'UNAUTHENTICATED',
    user: null,
    idToken: null,
    isRegistered: 0,
    registeredUser: {},
  },
  reducers: {},
  extraReducers: {
    [registerUser.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      goBackFromAuthToHome();
      Snackbar.show({
        text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
        duration: Snackbar.LENGTH_LONG,
      });
    },
    [socialAuth.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      const type = action.meta.arg;
      if (action.payload.isRegistered) {
        goBackFromAuthToHome();
        Snackbar.show({
          text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        Snackbar.show({
          text: 'Successfully logged in with ' + type,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    [loadAuth.fulfilled]: fulfillAuth,
    [emailLinkAuth.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      if (action.payload.isRegistered) {
        goBackFromAuthToHome();
        Snackbar.show({
          text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        Snackbar.show({
          text: 'Successfully logged in with Email',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    [signout.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
    },
    [votePost.rejected]: showAuthScreen,
    [voteComment.rejected]: showAuthScreen,
    [createReply.rejected]: showAuthScreen,
    [prepareReply.rejected]: showAuthScreen,
    [activate.rejected]: showAuthScreen,
  },
});

export const authorization = slice.reducer;
export const getAuthStatus = (state) => state.authorization.status;
export const getRegistrationStatus = (state) =>
  state.authorization.isRegistered;
