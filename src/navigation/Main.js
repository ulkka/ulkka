import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import {enableScreens} from 'react-native-screens';

import MyAccount from '../screens/home/MyAccount';
import Splash from '../screens/Splash';

import Login from '../screens/auth/Login';
import {navigationRef} from '../screens/auth/AuthNavigation';
import HomeNavigation from '../screens/home/HomeNavigation';
import CreateCommunity from '../screens/create/CreateCommunity';
import RegisterAccount from '../screens/auth/RegisterAccount';

import {
  getAuthStatus,
  getRegistrationStatus,
} from '../redux/reducers/AuthSlice';
import {useSelector, useDispatch} from 'react-redux';
import {loadAuth} from '../redux/actions/AuthActions';

const StackNav = createStackNavigator();
const DrawerNav = createDrawerNavigator();

enableScreens();

export default function Main(props) {
  const dispatch = useDispatch();

  const authStatus = useSelector(getAuthStatus);
  const isRegistered = useSelector(getRegistrationStatus);

  useEffect(() => {
    dispatch(loadAuth());
  }, []);

  const config = {
    screens: {
      Chat: 'feed/:sort',
      Profile: 'user',
    },
  };
  const linking = {
    prefixes: [
      'https://app.vellarikkapattanam.com',
      'https://vellarikkapattanam.com',
      'vellarikkapattanam://',
    ],
    config,
  };
  const LoadingNavigation = (
    <NavigationContainer>
      <StackNav.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <StackNav.Screen name="Splash" component={Splash} title="Splash" />
      </StackNav.Navigator>
    </NavigationContainer>
  );

  const SigninNavigation = () => {
    return (
      <StackNav.Navigator
        initialRouteName="Authentication"
        screenOptions={{
          headerStyle: {
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            borderTopEndRadius: 15,
            borderTopStartRadius: 15,
          },
        }}>
        <StackNav.Screen
          name={authStatus != 'AUTHENTICATED' ? 'Login' : 'Registration'}
          component={authStatus != 'AUTHENTICATED' ? Login : RegisterAccount}
          title="Authentication"
        />
      </StackNav.Navigator>
    );
  };

  const UserNavigation =
    authStatus == 'AUTHENTICATED' && isRegistered == 1 ? (
      <DrawerNav.Screen
        name="My Account"
        component={MyAccount}
        title="MyAccount"
      />
    ) : (
      <DrawerNav.Screen
        name="Login / Register"
        component={SigninNavigation}
        title="Login / Register"
        options={{
          animationEnabled: true,
        }}
      />
    );

  const DrawerAppNavigator = () => {
    return (
      <DrawerNav.Navigator
        initialRouteName="Home"
        drawerContentOptions={{
          activeTintColor: '#e91e63',
          itemStyle: {marginVertical: 5},
          activeBackgroundColor: '#ffe',
        }}>
        <DrawerNav.Screen name="Home" component={HomeNavigation} title="Home" />
        <DrawerNav.Screen
          name="Create Community"
          component={CreateCommunity}
          title="Create Community"
        />
        {UserNavigation}
      </DrawerNav.Navigator>
    );
  };

  const SignupModal =
    isRegistered == 0 ? (
      <StackNav.Screen
        name="Signup"
        component={SigninNavigation}
        title="Signup"
        options={{
          headerShown: false,
          cardStyle: {
            paddingTop: 25,
            backgroundColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.7,
            shadowRadius: 5,
          },
        }}
      />
    ) : null;

  const AppNavigation = (
    <NavigationContainer
      linking={linking}
      fallback={<Text>Loading...</Text>}
      ref={navigationRef}>
      <StackNav.Navigator initialRouteName="Home" mode="modal">
        <StackNav.Screen
          name="Home"
          component={DrawerAppNavigator}
          title="Home"
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        {SignupModal}
      </StackNav.Navigator>
    </NavigationContainer>
  );

  return authStatus == 'UNAUTHENTICATED' ? LoadingNavigation : AppNavigation;
}
