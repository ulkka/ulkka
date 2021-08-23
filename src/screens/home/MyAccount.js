import React from 'react';
import {SafeAreaView, Text, Button, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {signout} from '../../redux/actions/AuthActions';

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
      console.warn(error);
    }
  };

  return (
    <SafeAreaView>
      <Text>Hi Home </Text>
      <Button title="Log out" onPress={() => signoutConfirmationAlert()} />
    </SafeAreaView>
  );
}
