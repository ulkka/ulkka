import React, {useEffect} from 'react';
import {View, AppState} from 'react-native';
import auth from '@react-native-firebase/auth';
import mainClient from './mainClient';
import analytics from '@react-native-firebase/analytics';
import {useDispatch} from 'react-redux';
import {updateIDToken} from '../redux/reducers/AuthSlice';

const AuthIDTokenListener = () => {
  const dispatch = useDispatch();
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

  function handleAppStateChange(appState) {
    if (appState == 'active') {
      analytics().logAppOpen();
    }
  }

  async function handleIdTokenChange(user) {
    // token refreshed in mainClient.js refreshauthlogic
    const idToken = await auth()
      .currentUser?.getIdToken()
      .catch(error => console.error('error getting id token', error));
    if (idToken) {
      mainClient.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;
      dispatch(updateIDToken(idToken));
    }
  }

  return <View></View>;
};

export default AuthIDTokenListener;
