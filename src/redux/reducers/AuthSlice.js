import {createSlice} from '@reduxjs/toolkit';
import {
  signout,
  fulfillAuth,
  loadAuth,
  socialAuth,
  emailLinkAuth,
  registerUser,
  sendEmailSignInLink,
} from '../actions/AuthActions';
import Snackbar from 'react-native-snackbar';
import {showAuthScreen} from '../../navigation/Ref';
import RNRestart from 'react-native-restart';
import analytics from '@react-native-firebase/analytics';
import {handleError} from '../actions/common';

export const slice = createSlice({
  name: 'authorization',
  initialState: {
    status: 'UNAUTHENTICATED',
    user: null,
    // idToken: null,
    //isRegistered: 0,
    registeredUser: {},
  },
  reducers: {},
  extraReducers: {
    [loadAuth.fulfilled]: fulfillAuth,
    [socialAuth.fulfilled]: (state, action) => {
      const type = action.meta.arg;
      analytics().logLogin({method: type});
      if (action.payload.isRegistered) {
        setTimeout(() => {
          RNRestart.Restart();
          Snackbar.show({
            text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
            duration: Snackbar.LENGTH_LONG,
          });
        }, 500);
      } else {
        fulfillAuth(state, action);
        showAuthScreen();
        Snackbar.show({
          text: 'Successfully logged in with ' + type,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    [emailLinkAuth.fulfilled]: (state, action) => {
      analytics().logLogin({method: 'emaillink'});
      if (action.payload.isRegistered) {
        setTimeout(() => {
          RNRestart.Restart();
          Snackbar.show({
            text: 'Welcome ' + action.payload.registeredUser?.displayname + '!',
            duration: Snackbar.LENGTH_LONG,
          });
        }, 500);
      } else {
        fulfillAuth(state, action);
        showAuthScreen();
        Snackbar.show({
          text: 'Successfully logged in with Email',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    [registerUser.fulfilled]: (state, action) => {
      const providerId = action.payload.currentUser.providerData[0]?.providerId;
      analytics().logSignUp({method: providerId});
      setTimeout(() => {
        RNRestart.Restart();
        Snackbar.show({
          text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
          duration: Snackbar.LENGTH_LONG,
        });
      }, 500);
    },
    [signout.fulfilled]: (state, action) => {
      analytics().logEvent('user_logout', {type: 'registered'});
      const info = action.meta.arg;
      if (!info) {
        setTimeout(() => {
          RNRestart.Restart();
          Snackbar.show({
            text: 'Signed out',
            duration: Snackbar.LENGTH_LONG,
          });
        }, 1000);
      } else {
        fulfillAuth(state, action);
      }
    },
    [loadAuth.rejected]: handleError,
    [socialAuth.rejected]: handleError,
    [emailLinkAuth.rejected]: handleError,
    [sendEmailSignInLink.rejected]: handleError,
    [registerUser.rejected]: handleError,
    [signout.rejected]: handleError,
  },
});

export const authorization = slice.reducer;
export const getAuthStatus = (state) => state.authorization.status;
export const getRegistrationStatus = (state) =>
  state.authorization.isRegistered;
export const getRegisteredUser = (state) => state.authorization.registeredUser;
