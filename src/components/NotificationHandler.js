import React, {useEffect} from 'react';
import {Alert, View, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Snackbar from 'react-native-snackbar';
import {useLinkTo} from '@react-navigation/native';
import {navigate} from '../navigation/Ref';

function getPathNameFromRemoteMessage(remoteMessage) {
  return remoteMessage.data?.path && remoteMessage.data?.path?.length
    ? remoteMessage.data.path
    : '/';
}

const NotificationHandler = () => {
  const linkTo = useLinkTo();
  useEffect(() => {
    requestUserPermission();

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          const path = getPathNameFromRemoteMessage(remoteMessage);
          linkTo(path);
        }
      });

    //// Check whether a notification arrived while app is on foreground
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const path = getPathNameFromRemoteMessage(remoteMessage);
      console.log('navigating to path', path);
      Snackbar.show({
        text: remoteMessage.notification?.body,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'View',
          textColor: 'green',
          onPress: () => linkTo(path),
        },
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      const path = remoteMessage.data?.path;
      linkTo(path);
    });
    return unsubscribe;
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification Authorization status:', authStatus);
    }
  }

  return <View></View>;
};

export default NotificationHandler;
