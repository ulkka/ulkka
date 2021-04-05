import {createAsyncThunk} from '@reduxjs/toolkit';
import {GoogleSignin} from '@react-native-community/google-signin';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import userApi from '../../services/UserApi';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openInbox} from 'react-native-email-link';
import PushNotification from 'react-native-push-notification';

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

const getRegisteredUser = async (currentUser) => {
  let registeredUser = undefined;
  if (!currentUser.isAnonymous) {
    const userEmail = await currentUser.email;
    const response = await userApi.user.getUserByEmail(userEmail);
    if (response.data.length) {
      registeredUser = response.data[0];
    }
  }
  return registeredUser;
};

const isUserRegistered = async (currentUser) => {
  let isRegistered = 0;
  if (!currentUser.isAnonymous) {
    const registeredUser = await getRegisteredUser(currentUser);
    if (registeredUser?.displayname) {
      isRegistered = 1;
    }
  }
  return isRegistered;
};

const initAuth = async () => {
  const currentUser = await getCurrentUser();
  const isRegistered = await isUserRegistered(currentUser);
  const registeredUser = await getRegisteredUser(currentUser);
  return {
    currentUser: currentUser,
    isRegistered: isRegistered,
    registeredUser: registeredUser,
  };
};

export const fulfillAuth = (state, action) => {
  const {currentUser, isRegistered, registeredUser} = action.payload;
  state.user = currentUser;
  if (currentUser.isAnonymous) {
    state.status = 'ANONYMOUS';
  } else {
    state.status = 'AUTHENTICATED';
  }
  state.isRegistered = isRegistered;
  state.registeredUser = registeredUser;
};

export const loadAuth = createAsyncThunk(
  'authorization/load',
  async (arg, {rejectWithValue}) => {
    try {
      return initAuth();
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
);

export const socialAuth = createAsyncThunk(
  'authorization/login/social',
  async (type, {rejectWithValue}) => {
    try {
      const data = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      await auth().signInWithCredential(googleCredential);
      return initAuth();
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
);

export const emailLinkAuth = createAsyncThunk(
  'authorization/login/emaillink',
  async (data, {rejectWithValue}) => {
    try {
      const {email, link} = data;
      await auth().signInWithEmailLink(email, link.url);
      return initAuth();
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
);
const actionCodeSettings = {
  handleCodeInApp: true,
  // URL must be whitelisted in the Firebase Console.
  url: 'https://vellarikkapattanam.page.link/naxz',
  iOS: {
    bundleId: 'org.reactjs.native.example.VellarikkaPattanam',
  },
  android: {
    packageName: 'com.dubiousknight.vellarikkapattanam',
    installApp: true,
    //  minimumVersion: '12',
  },
};

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('emailForSignIn', value);
  } catch (e) {
    // saving error
    console.log('error saving email in async storage', e);
  }
};

export const sendEmailSignInLink = createAsyncThunk(
  'authorization/sendEmailSigninLink',
  async (email, {rejectWithValue}) => {
    try {
      // Save the email for latter usage
      storeData(email);
      await auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(async () => {
          await openInbox({
            title: `Login link sent to ${email}`,
            message:
              'Please check your email and click on the link to login/register',
          }).catch((error) => {
            Alert.alert(
              `Login link sent to ${email}.`,
              'Please check your email and click on the link to login/register',
            );
          });
        });
    } catch (error) {
      console.log(error?.message);
      return rejectWithValue(error?.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  'authorization/register',
  async (displayname, {rejectWithValue}) => {
    try {
      await userApi.user.signup(displayname);
      return initAuth();
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
);

export const signout = createAsyncThunk(
  'authorization/signout',
  async (arg, {rejectWithValue}) => {
    try {
      PushNotification.removeAllDeliveredNotifications();
      const pushMessageToken = await messaging()
        .getToken()
        .catch((error) => {
          console.log(
            'error getting pushmessage token while signing out',
            error,
          );
          return '';
        });

      await userApi.user.logout(pushMessageToken); // unlink device token from users account server side

      const isGoogleSignedIn = await GoogleSignin.isSignedIn().valueOf();
      if (isGoogleSignedIn) {
        await GoogleSignin.signOut();
      }
      await auth().signOut();
      return initAuth();
    } catch (error) {
      return rejectWithValue(error?.response);
    }
  },
);
