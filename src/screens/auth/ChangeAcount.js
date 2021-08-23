import React, {useContext} from 'react';
import {View, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {signout} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {Button, ThemeContext} from 'react-native-elements';
import analytics from '@react-native-firebase/analytics';

export default function ChangeAccount() {
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);

  const email = auth().currentUser.email;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 15,
        paddingHorizontal: 10,
        backgroundColor: theme.colors.grey2,
      }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '500',
          paddingHorizontal: 15,
          color: theme.colors.green,
        }}>
        {' '}
        {email}
        {'  '}
      </Text>
      <Button
        title="Logout"
        onPress={() => {
          analytics().logEvent('user_logout', {type: 'unregistered'});
          dispatch(signout('norestart'));
        }}
        type="clear"
        titleStyle={{color: theme.colors.blue, fontSize: 14}}
      />
    </View>
  );
}
