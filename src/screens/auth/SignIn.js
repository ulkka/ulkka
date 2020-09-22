import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';

GoogleSignin.configure({
  scopes: ['openid', 'email', 'profile'],
  webClientId: '125095692098-jvns3h2vfqkf3ufrb0kcqhf1k2abicog.apps.googleusercontent.com',
});

export default function SignIn(props) {

  var authFlag = true;

  const onGoogleButtonPress = async () => {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }

  const onEmailButtonPress = async () => {
    var credential = auth.EmailAuthProvider.credential('arjunswarrier@gmail.com', 'kuttettan');
    return auth().signInWithCredential(credential);
  }

  async function onAuthStateChanged(user) {
    if (authFlag) {
      authFlag = false;
      if (user) {
        await auth().currentUser.getIdToken(false).then((id_token) => {
          props.addAuth(user, id_token);
          console.log('in user', user);
        }).catch((e) => {
          console.log(e);
        })
      } else {
        console.log('null user');
      }
    }
    authFlag = true;
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View>
      <Text>Login</Text>
      <Button
        title="Google Sign-In"
        onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
      />
      <Button
        title="Email Sign-In"
        onPress={() => onEmailButtonPress().then(() => console.log('Signed in with Email!'))}
      />
    </View>
  );

}