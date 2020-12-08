import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
// import auth from '@react-native-firebase/auth';
import mainClient from '../client/mainClient';
// import messaging from '@react-native-firebase/messaging';

export default function RegisterDeviceToken() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  // const getUserIdFromServer = async () => {
  //   const client = await mainClient;
  //   client
  //     .get('user?query={"email":"' + email + '"}')
  //     .then((response) => {
  //       setUserId(response.data[0]._id);
  //     })
  //     .catch((error) => {
  //       console.log('error getting user id from server - ', error);
  //     });
  // };

  // const setTokenAndEmail = async (token) => {
  //   // Assume user is already signed in
  //   setToken(token);
  //   setEmail(auth().currentUser.email);
  // };

  // const saveTokenToDb = async () => {
  //   const client = await mainClient;
  //   client
  //     .put('user/' + userId, {
  //       pushMessageToken: token,
  //     })
  //     .then((response) => {
  //       console.log(
  //         'registered device token for notification',
  //         response.data.pushMessageToken,
  //       );
  //     })
  //     .catch((error) => {
  //       console.log('error registering token - ', error);
  //     });
  // };

  // useEffect(() => {
  //   if (userId != '') {
  //     saveTokenToDb();
  //   }
  // }, [userId]);

  // useEffect(() => {
  //   if (email != '') {
  //     getUserIdFromServer();
  //   }
  // }, [email]);

  // useEffect(() => {
  //   // Get the device token
  //   messaging()
  //     .getToken()
  //     .then((token) => {
  //       return setTokenAndEmail(token);
  //     });

  //   // If using other push notification providers (ie Amazon SNS, etc)
  //   // you may need to get the APNs token instead for iOS:
  //   // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

  //   // Listen to whether the token changes
  //   return messaging().onTokenRefresh((token) => {
  //     setTokenAndEmail(token);
  //   });
  // }, []);

  return <View></View>;
}
