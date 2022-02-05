import React from 'react';
import {Platform, SafeAreaView} from 'react-native';
import {useTheme} from 'react-native-elements';
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
import {useTranslation} from 'react-i18next';

export const AuthNavigation = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();

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
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <StackNav.Navigator
        screenOptions={{
          headerBackTitle: '',
          headerStatusBarHeight: 0,
          headerStyle: headerStyle,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: Platform.OS == 'ios' ? 17 : 15,
            color: theme.colors.black4,
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
              ? t('Login/Register')
              : 'Create Account',
          }}
          initialParams={{userId: registeredUser?._id}}
        />
      </StackNav.Navigator>
    </SafeAreaView>
  );
};
