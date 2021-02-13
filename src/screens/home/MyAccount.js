import React from 'react';
import {View, Text, Button, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {useDispatch} from 'react-redux';
import {signout} from '../../redux/actions/AuthActions';

GoogleSignin.configure({
  scopes: ['openid', 'email', 'profile'],
  webClientId:
    '125095692098-jvns3h2vfqkf3ufrb0kcqhf1k2abicog.apps.googleusercontent.com',
});

export default function MyAccount(props) {
  const dispatch = useDispatch();

  const signoutConfirmationAlert = () =>
    Alert.alert('Log out ?', null, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => signOut()},
    ]);

  const signOut = async () => {
    try {
      dispatch(signout());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Hi Home </Text>
      <Button title="Log out" onPress={() => signoutConfirmationAlert()} />
    </View>
  );
}
