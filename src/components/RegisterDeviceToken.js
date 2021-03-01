import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import userApi from '../services/UserApi';
import {
  getRegisteredUser,
  getRegistrationStatus,
} from '../redux/reducers/AuthSlice';
import {useSelector} from 'react-redux';

export default function RegisterDeviceToken() {
  const [token, setToken] = useState('');
  const isRegistered = useSelector(getRegistrationStatus);
  const registeredUser = useSelector(getRegisteredUser);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return setToken(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      setToken(token);
    });
  }, []);

  useEffect(() => {
    saveToken();
  }, [token]);

  useEffect(() => {
    if (isRegistered) {
      saveToken();
    }
  }, [isRegistered]);

  const saveToken = async () => {
    if (isRegistered) {
      await userApi.user.registerDeviceTokenForNotifications(
        registeredUser._id,
        token,
      );
    }
  };

  return <View></View>;
}
