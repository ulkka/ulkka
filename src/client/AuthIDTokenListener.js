import React, {useEffect} from 'react';
import {View, AppState} from 'react-native';
import auth from '@react-native-firebase/auth';
import mainClient from './mainClient';
import analytics from '@react-native-firebase/analytics';

const AuthIDTokenListener = () => {
  useEffect(() => {
    const subscriber = auth().onIdTokenChanged(handleIdTokenChange);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    const subscriber = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return subscriber; // unsubscribe on unmount
  }, []);

  async function handleAppStateChange(appState) {
    if (appState == 'active') {
      await auth().currentUser?.getIdToken(true);
      analytics().logAppOpen();
    }
  }

  async function handleIdTokenChange(user) {
    // token refreshed in mainClient.js refreshauthlogic
    const idToken = await auth().currentUser?.getIdToken();
    if (idToken) {
      mainClient.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;
    }
  }

  return <View></View>;
};

export default AuthIDTokenListener;
