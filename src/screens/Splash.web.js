import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
// import auth from '@react-native-firebase/auth';

export default function Splash(props) {
  var authFlag = true;

  // async function onAuthStateChanged(user) {
  //   if (authFlag) {
  //     authFlag = false;
  //     if (user) {
  //       await auth()
  //         .currentUser.getIdToken(false)
  //         .then((id_token) => {
  //           //props.addAuth(user, id_token);
  //           props.onAuthenticate(user, id_token);
  //           console.log('User logged in - ', user);
  //         })
  //         .catch((e) => {
  //           console.log(e);
  //         });
  //     } else {
  //       console.log('unauthenticated user - signing in anonymously');
  //       /*  auth()
  //         .signInAnonymously()
  //         .then(() => {
  //           console.log('User signed in anonymously');
  //         })
  //         .catch((error) => {
  //           if (error.code === 'auth/operation-not-allowed') {
  //             console.log('Enable anonymous in your firebase console.');
  //           }

  //           console.error(error);
  //         });*/
  //       props.removeAuth();
  //     }
  //   }
  //   authFlag = true;
  // }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  );
}
