import {createSlice} from '@reduxjs/toolkit';
import {
  signout,
  fulfillAuth,
  loadAuth,
  socialAuth,
  emailLinkAuth,
  registerUser,
} from '../actions/AuthActions';
import Snackbar from 'react-native-snackbar';
import {showAuthScreen} from '../../navigation/Ref';
import RNRestart from 'react-native-restart';

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
      setTimeout(() => {
        RNRestart.Restart();
        Snackbar.show({
          text: 'Welcome ' + action.payload.registeredUser.displayname + '!',
          duration: Snackbar.LENGTH_LONG,
        });
      }, 1000);
    },
    [signout.fulfilled]: (state, action) => {
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
    [loadAuth.rejected]: (state, action) => {
      console.log('load auth rejected', action.error?.message);
      Snackbar.show({
        text: 'Sorry, please try again later! ',
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
