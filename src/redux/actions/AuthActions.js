import {createAsyncThunk} from '@reduxjs/toolkit';
import {GoogleSignin} from '@react-native-community/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import userApi from '../../services/UserApi';
import {Alert, Platform} from 'react-native';
import {openInbox} from 'react-native-email-link';
import PushNotification from 'react-native-push-notification';
import analytics from '@react-native-firebase/analytics';
import {storeData} from '../../localStorage/helpers';

GoogleSignin.configure({
  scopes: ['openid', 'email', 'profile'],
  iosClientId:
    '413705214817-5hlot26lmlqmm9gffs173tc0kuvavtqr.apps.googleusercontent.com',
  webClientId:
    '413705214817-2pgh3sg6hdfhfegnvmcamv3jmg0m78jb.apps.googleusercontent.com',
});

const getCurrentUser = async () => {
  let currentUser = await auth().currentUser;

  if (!currentUser) {
    await auth().signInAnonymously();
    currentUser = await auth().currentUser;
  }
  return currentUser;
};

const getRegisteredUser = async currentUser => {
  let registeredUser = undefined;
  if (!currentUser.isAnonymous) {
    const response = await userApi.user.self();

    if (response) {
      registeredUser = response.data;
    }
  }
  return registeredUser;
};

const getRegisteredUserCommunities = async currentUser => {
  let registeredUserCommunities;
  if (!currentUser.isAnonymous) {
    const response = await userApi.user.selfCommunities();
    if (response) {
      registeredUserCommunities = response.data;
    }
  }
  return registeredUserCommunities;
};

const isUserRegistered = async registeredUser => {
  const isRegistered = registeredUser?.displayname ? 1 : 0;
  return isRegistered;
};

const initAuth = async () => {
  await auth().currentUser?.getIdToken(true);
  const currentUser = await getCurrentUser();

  const registeredUser = await getRegisteredUser(currentUser);

  const isRegistered = await isUserRegistered(registeredUser);

  let registeredUserCommunities;
  if (isRegistered) {
    registeredUserCommunities = await getRegisteredUserCommunities(currentUser);
  }
  return {
    currentUser: currentUser,
    isRegistered: isRegistered,
    registeredUser: isRegistered ? registeredUser : undefined,
    registeredUserCommunities,
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
      return rejectWithValue(error);
    }
  },
);

async function getCredential(type) {
  if (type == 'Google') {
    const data = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
    return googleCredential;
  }
  if (type == 'Apple') {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return appleCredential;
  }
}

export const socialAuth = createAsyncThunk(
  'authorization/login/social',
  async (type, {rejectWithValue}) => {
    try {
      const credential = await getCredential(type);
      await auth().signInWithCredential(credential);
      return initAuth();
    } catch (error) {
      return rejectWithValue(error);
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
      return rejectWithValue(error);
    }
  },
);
const actionCodeSettings = {
  handleCodeInApp: true,
  // URL must be whitelisted in the Firebase Console.
  url: 'https://link.omong.id/6Tkp',
  iOS: {
    bundleId: 'id.omong',
  },
  android: {
    packageName: 'id.omong',
    installApp: true,
    //  minimumVersion: '12',
  },
};

export const sendEmailSignInLink = createAsyncThunk(
  'authorization/sendEmailSigninLink',
  async (email, {rejectWithValue}) => {
    try {
      // Save the email for latter usage
      await storeData('emailForSignIn', email);
      await auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(async () => {
          await analytics().logEvent('emaillink_send');
          if (Platform.OS == 'ios') {
            await openInbox({
              title: `Login link sent to ${email}`,
              message:
                'Please check your email and click on the link to login/register',
            }).catch(error => {
              Alert.alert(
                `Login link sent to ${email}.`,
                'Please check your email and click on the link to login/register',
              );
            });
          } else {
            Alert.alert(
              `Login link sent to ${email}.`,
              'Please check your email and click on the link to login/register. Email delivery may take upto 2 minutes',
            );
          }
        });
    } catch (error) {
      console.warn(error?.message);
      return rejectWithValue(error);
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
      return rejectWithValue(error);
    }
  },
);

const cleanupNotifications = async () => {
  PushNotification.removeAllDeliveredNotifications();
  const pushMessageToken = await messaging()
    .getToken()
    .catch(error => {
      console.warn('error getting pushmessage token while signing out', error);
      return '';
    });

  await userApi.user.logout(pushMessageToken); // unlink device token from users account server side
};

export const signout = createAsyncThunk(
  'authorization/signout',
  async (arg, {rejectWithValue, getState}) => {
    try {
      const isUserRegistered = getState().authorization.isRegistered;
      if (isUserRegistered) {
        await cleanupNotifications();
      }
      const isGoogleSignedIn = await GoogleSignin.isSignedIn().valueOf();
      if (isGoogleSignedIn) {
        await GoogleSignin.signOut();
      }
      await auth().signOut();
      return initAuth();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
