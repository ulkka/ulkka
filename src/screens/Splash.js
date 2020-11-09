import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import actions from '../redux/actions/AuthActions';
import {connect} from 'react-redux';

export default function Splash(props) {
  var authFlag = true;

  async function onAuthStateChanged(user) {
    if (authFlag) {
      authFlag = false;
      if (user) {
        await auth()
          .currentUser.getIdToken(false)
          .then((id_token) => {
            //props.addAuth(user, id_token);
            props.onAuthenticate(user, id_token);
            console.log('User logged in - ', user.displayName);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log('unauthenticated user');
        props.removeAuth();
      }
    }
    authFlag = true;
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  );
}
