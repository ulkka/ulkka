import React, {useEffect, useState} from 'react';
import {View, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import userApi from '../services/UserApi';
import {getRegistrationStatus} from '../redux/reducers/AuthSlice';
import {useSelector} from 'react-redux';

export default function RegisterDeviceToken() {
  const [token, setToken] = useState('');
  const isRegistered = useSelector(getRegistrationStatus);

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
      requestUserPermission(); // request notification permission on login/register
    }
  }, [isRegistered]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      saveToken();
      console.log('Notification Authorization status:', authStatus);
    }
  }

  const saveToken = async () => {
    if (Platform.OS == 'android') {
      messaging()
        .subscribeToTopic('allDevices')
        .then(() => console.log('Subscribed to topic!'))
        .catch((error) => console.log('Error subscribing to topic', error));
    }
    if (isRegistered && token.length) {
      userApi.user.registerDeviceTokenForNotifications(token);
      //ios asks for notifications only after registration
      if (Platform.OS == 'ios') {
        messaging()
          .subscribeToTopic('allDevices')
          .then(() => console.log('Subscribed to topic!'))
          .catch((error) => console.log('Error subscribing to topic', error));
      }
    }
  };

  return <View></View>;
}
