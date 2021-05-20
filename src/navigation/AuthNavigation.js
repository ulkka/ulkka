import React, {useEffect} from 'react';
import {Platform, SafeAreaView} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getAuthStatus,
  getRegistrationStatus,
  getRegisteredUser,
} from '../redux/reducers/AuthSlice';
import {useSelector} from 'react-redux';
import RegisterAccount from '../screens/auth/RegisterAccount';
import Login from '../screens/auth/Login';
import UserDetailTabView from '../screens/user/UserDetailTabView';

export const AuthNavigation = () => {
  const StackNav = createStackNavigator();
  const isRegistered = useSelector(getRegistrationStatus);
  const authStatus = useSelector(getAuthStatus);
  const registeredUser = useSelector(getRegisteredUser);

  const headerStyle =
    Platform.OS == 'ios'
      ? {
          height: 40,
        }
      : {height: 40};

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
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
              : 'Create Account'
          }
          component={
            isRegistered
              ? UserDetailTabView
              : authStatus != 'AUTHENTICATED'
              ? Login
              : RegisterAccount
          }
          title={
            isRegistered
              ? 'My Account'
              : authStatus != 'AUTHENTICATED'
              ? 'Login'
              : 'Create Account'
          }
          options={{
            headerTitle: isRegistered
              ? 'My Account'
              : authStatus != 'AUTHENTICATED'
              ? 'Login / Register'
              : 'Create Account',
          }}
          initialParams={{userId: registeredUser?._id}}
        />
      </StackNav.Navigator>
    </SafeAreaView>
  );
};
