import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getAuthStatus,
  getRegistrationStatus,
} from '../redux/reducers/AuthSlice';
import {useSelector} from 'react-redux';
import MyAccount from '../screens/home/MyAccount';
import RegisterAccount from '../screens/auth/RegisterAccount';
import Login from '../screens/auth/Login';

export const AuthNavigation = () => {
  const StackNav = createStackNavigator();
  const isRegistered = useSelector(getRegistrationStatus);
  const authStatus = useSelector(getAuthStatus);
  return (
    <StackNav.Navigator
      screenOptions={{
        headerBackTitle: '',
        headerStatusBarHeight: 0,
        headerStyle: {
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
        },
      }}>
      <StackNav.Screen
        name={
          isRegistered
            ? 'My Account'
            : authStatus != 'AUTHENTICATED'
            ? 'Login'
            : 'Register Account'
        }
        component={
          isRegistered
            ? MyAccount
            : authStatus != 'AUTHENTICATED'
            ? Login
            : RegisterAccount
        }
        title={
          isRegistered
            ? 'My Account'
            : authStatus != 'AUTHENTICATED'
            ? 'Login'
            : 'Register Account'
        }
      />
    </StackNav.Navigator>
  );
};
