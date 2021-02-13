import {createAsyncThunk} from '@reduxjs/toolkit';
import {GoogleSignin} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import userApi from '../../services/UserApi';
import {navigate} from '../../screens/auth/AuthNavigation';
import mainClient from '../../client/mainClient';

GoogleSignin.configure({
  scopes: ['openid', 'email', 'profile'],
  iosClientId:
    '125095692098-59niqmb4q23se9im25r19rcous61iotk.apps.googleusercontent.com',
  webClientId:
    '125095692098-jvns3h2vfqkf3ufrb0kcqhf1k2abicog.apps.googleusercontent.com',
});

const getCurrentUser = async () => {
  let currentUser = await auth().currentUser;
  if (!currentUser) {
    await auth().signInAnonymously();
    currentUser = await auth().currentUser;
  }
  return currentUser;
};

const isUserRegistered = async (currentUser) => {
  let isRegistered = 0;
  const userEmail = await currentUser.email;
  if (!currentUser.isAnonymous) {
    const response = await userApi.user.accountExists(userEmail);
    isRegistered = response.data.length;
  }
  return isRegistered;
};

const initAuth = async () => {
  const currentUser = await getCurrentUser();
  const idToken = await currentUser.getIdToken(false);
  const isRegistered = await isUserRegistered(currentUser);
  return {
    currentUser: currentUser,
    idToken: idToken,
    isRegistered: isRegistered,
  };
};

export const fulfillAuth = (state, action) => {
  const currentUser = action.payload.currentUser;
  const idToken = action.payload.idToken;
  const isRegistered = action.payload.isRegistered;
  state.user = currentUser;
  console.log('curent user email -- ', currentUser);
  if (currentUser.isAnonymous) {
    state.status = 'ANONYMOUS';
  } else {
    state.status = 'AUTHENTICATED';
  }
  state.idToken = idToken;
  state.isRegistered = isRegistered;
  mainClient.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;
};

export const showAuthScreen = (state, action) => {
  navigate('Signup');
};

export const loadAuth = createAsyncThunk('authorization/load', initAuth);

export const socialAuth = createAsyncThunk(
  'authorization/login/social',
  async (type, {rejectWithValue}) => {
    const data = await GoogleSignin.signIn().catch((e) => {
      console.log('Social Auth Error', e);
      rejectWithValue('Social auth unsuccessful');
      return;
    });
    const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
    await auth().signInWithCredential(googleCredential);
    return initAuth();
  },
);

export const emailLinkAuth = createAsyncThunk(
  'authorization/login/emaillink',
  async (data) => {
    const {email, link} = data;
    await auth().signInWithEmailLink(email, link.url);
    return initAuth();
  },
);

export const registerUser = createAsyncThunk(
  'authorization/register',
  async (displayname) => {
    await userApi.user.signup({displayname: displayname});
  },
);

export const signout = createAsyncThunk(
  'authorization/signout',
  async (arg, thunkAPI) => {
    const isGoogleSignedIn = await GoogleSignin.isSignedIn().valueOf();
    if (isGoogleSignedIn) {
      await GoogleSignin.signOut();
    }
    await auth().signOut();
    return initAuth();
  },
);
