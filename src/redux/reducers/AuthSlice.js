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
import {blockUser, unblockUser, updateDisplayname} from './UserSlice';
import Snackbar from 'react-native-snackbar';
import {showAuthScreen} from '../../navigation/Ref';
import RNRestart from 'react-native-restart';
import analytics from '@react-native-firebase/analytics';
import {handleError} from '../actions/common';

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

export const slice = createSlice({
  name: 'authorization',
  initialState: {
    status: 'UNAUTHENTICATED',
    user: null,
    registeredUser: {},
  },
  reducers: {
    updateIDToken(state, action) {
      const idToken = action.payload;
      state.idToken = idToken;
    },
  },
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
        }, 100);
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
        }, 100);
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
      }, 100);
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
        }, 500);
      } else {
        fulfillAuth(state, action);
      }
    },
    [blockUser.fulfilled]: (state, action) => {
      const blockedUserId = action.payload;
      const registeredUser = state.registeredUser;
      const currentBlockedUsers = registeredUser.blockedUsers;
      registeredUser.blockedUsers = [...currentBlockedUsers, blockedUserId];
      setTimeout(
        () =>
          Snackbar.show({
            text: 'User Blocked',
            duration: Snackbar.LENGTH_SHORT,
          }),
        100,
      );
      analytics().logEvent('user_block');
    },
    [unblockUser.fulfilled]: (state, action) => {
      const unblockedUserId = action.payload;
      const registeredUser = state.registeredUser;
      const currentBlockedUsers = registeredUser.blockedUsers;
      registeredUser.blockedUsers = removeItemAll(
        [...currentBlockedUsers],
        unblockedUserId,
      );
      setTimeout(
        () =>
          Snackbar.show({
            text: 'User unblocked',
            duration: Snackbar.LENGTH_SHORT,
          }),
        100,
      );
      analytics().logEvent('user_unblock');
    },
    [updateDisplayname.fulfilled]: (state, action) => {
      const {id, displayname} = action.payload;
      const registeredUser = state.registeredUser;
      registeredUser.displayname = displayname;
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
export const getIDToken = (state) => state.authorization.idToken;
export const getBlockedUsers = (state) =>
  state.authorization.registeredUser?.blockedUsers;

export const {updateIDToken} = slice.actions;
