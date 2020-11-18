import React, {useEffect} from 'react';
import {View} from 'react-native';
import auth from '@react-native-firebase/auth';
import mainClient from '../client/mainClient';
import messaging from '@react-native-firebase/messaging';

export default function RegisterDeviceToken() {
  const getUserIdFromServer = async (email) => {
    const client = await mainClient;
    const userIdResponse = await client
      .get('user?query={"email":"' + email + '"}')
      .catch((error) => {
        console.log('error getting user id from server - ', error);
      });
    const userId = userIdResponse.data[0]._id;
    return userId;
  };

  const saveTokenToDatabase = async (token) => {
    // Assume user is already signed in
    const email = auth().currentUser.email;

    const userId = await getUserIdFromServer(email);

    const client = await mainClient;
    // Add the token to the users db
    client
      .put('user/' + userId, {
        pushMessageToken: token,
      })
      .then((response) => {
        console.log(
          'registered device token for notification',
          response.data.pushMessageToken,
        );
      })
      .catch((error) => {
        console.log('error registering token - ', error);
      });
  };

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return saveTokenToDatabase(token);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);

  return <View></View>;
}
