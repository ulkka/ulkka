import React, {useEffect} from 'react';
import {Alert, View, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Snackbar from 'react-native-snackbar';
import {useLinkTo} from '@react-navigation/native';
import navigate from '../navigation/Ref';

const NotificationHandler = () => {
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
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          const link = remoteMessage.data?.link;
          //  link && Linking.openURL(link);
        }
        // setLoading(false);
      });

    //// Check whether a notification arrived while app is on foreground
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Snackbar.show({
        text: remoteMessage.notification?.body,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'View',
          textColor: 'green',
          // onPress: () => navigate('CreatePost'),
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
      // navigation.navigate(remoteMessage.data.type);
      const link = remoteMessage.data?.link;
      // link && Linking.openURL(link);
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
