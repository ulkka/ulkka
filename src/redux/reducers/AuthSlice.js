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
} from '../actions/AuthActions';
import Snackbar from 'react-native-snackbar';
import {goBack, showAuthScreen} from '../../navigation/Ref';

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
    [loadAuth.fulfilled]: fulfillAuth,
    [socialAuth.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      const type = action.meta.arg;
      if (action.payload.isRegistered) {
        goBack();
        Snackbar.show({
          text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        showAuthScreen();
        Snackbar.show({
          text: 'Successfully logged in with ' + type,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    [emailLinkAuth.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      if (action.payload.isRegistered) {
        goBack();
        Snackbar.show({
          text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        showAuthScreen();
        Snackbar.show({
          text: 'Successfully logged in with Email',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    [registerUser.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      goBack();
      Snackbar.show({
        text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
        duration: Snackbar.LENGTH_LONG,
      });
    },
    [signout.fulfilled]: (state, action) => {
      fulfillAuth(state, action);
      goBack();
      Snackbar.show({
        text: 'Signed out',
        duration: Snackbar.LENGTH_SHORT,
      });
    },
    [votePost.rejected]: showAuthScreen,
    [voteComment.rejected]: showAuthScreen,
    [createReply.rejected]: showAuthScreen,
    [prepareReply.rejected]: showAuthScreen,
    [activate.rejected]: showAuthScreen,
    [loadAuth.rejected]: (state, action) => {
      console.log('load auth rejected', action.error.message);
      Snackbar.show({
        text: 'Sorry, please try again later! ' + action.error.message,
        duration: Snackbar.LENGTH_LONG,
      });
    },
  },
});

export const authorization = slice.reducer;
export const getAuthStatus = (state) => state.authorization.status;
export const getRegistrationStatus = (state) =>
  state.authorization.isRegistered;
export const getRegisteredUser = (state) => state.authorization.registeredUser;
