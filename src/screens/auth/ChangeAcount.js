import React from 'react';
import {View, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {signout} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {Button} from 'react-native-elements';

export default function ChangeAccount() {
  const dispatch = useDispatch();
  const email = auth().currentUser.email;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 10,
        backgroundColor: '#eee',
      }}>
      <Text style={{fontSize: 15, fontWeight: '500', paddingHorizontal: 15}}>
        {' '}
        {email}{' '}
      </Text>
      <Button
        title="Logout"
        onPress={() => dispatch(signout('norestart'))}
        type="clear"
        titleStyle={{color: '#6874e8', fontSize: 14}}
      />
    </View>
  );
}
