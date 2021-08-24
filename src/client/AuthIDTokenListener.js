import React, {useEffect} from 'react';
import {View} from 'react-native';
import auth from '@react-native-firebase/auth';
import mainClient from './mainClient';
import {useDispatch} from 'react-redux';
import {updateIDToken} from '../redux/reducers/AuthSlice';

const AuthIDTokenListener = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const subscriber = auth().onIdTokenChanged(handleIdTokenChange);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function handleIdTokenChange(user) {
    // token refreshed in mainClient.js refreshauthlogic
    const idToken = await auth()
      .currentUser?.getIdToken()
      .catch(error => console.warn('error getting id token', error));
    if (idToken) {
      mainClient.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;
      dispatch(updateIDToken(idToken));
    }
  }

  return <View></View>;
};

export default AuthIDTokenListener;
