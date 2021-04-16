import React from 'react';
import {Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getAuthStatus,
  getRegistrationStatus,
  getRegisteredUser,
} from '../redux/reducers/AuthSlice';
import {useSelector} from 'react-redux';
//import MyAccount from '../screens/home/MyAccount';
import RegisterAccount from '../screens/auth/RegisterAccount';
import Login from '../screens/auth/Login';
import UserDetail from '../screens/user/UserDetail';

export const AuthNavigation = () => {
  const StackNav = createStackNavigator();
  const isRegistered = useSelector(getRegistrationStatus);
  const authStatus = useSelector(getAuthStatus);
  const registeredUser = useSelector(getRegisteredUser);

  const headerStyle =
    Platform.OS == 'ios'
      ? {
          height: 40,
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
        }
      : {height: 40};

  return (
    <StackNav.Navigator
      screenOptions={{
        headerBackTitle: '',
        headerStatusBarHeight: 0,
        headerStyle: headerStyle,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: Platform.OS == 'ios' ? 17 : 15,
          color: '#444',
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
            ? UserDetail
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
        initialParams={{userId: registeredUser?._id}}
      />
    </StackNav.Navigator>
  );
};
