import React from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';

GoogleSignin.configure({
  scopes: ['openid', 'email', 'profile'],
  webClientId: '125095692098-jvns3h2vfqkf3ufrb0kcqhf1k2abicog.apps.googleusercontent.com',
});

export default function MyAccount(props) {

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      auth().signOut().then(() => console.log('User signed out!'));
      props.removeAuth();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Hi Home {props.id_token}</Text>
      <Button
        title="Signout"
        onPress={() => auth().signOut().then(() => console.log('User signed out!'))}
      />
      <Button
        title="Signout completely"
        onPress={() => signOut()}
      />
    </View>
  );
}