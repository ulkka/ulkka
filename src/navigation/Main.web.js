import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import {enableScreens} from 'react-native-screens';

import MyAccount from '../redux/connectors/MyAccount';
import Splash from '../redux/connectors/Splash';
import SignIn from '../redux/connectors/SignIn';
import CreateAccount from '../screens/auth/CreateAccount';

import {navigationRef} from '../screens/auth/AuthNavigation';
import HomeNavigation from '../screens/home/HomeNavigation';
import CreateCommunity from '../screens/create/CreateCommunity';

const StackNav = createStackNavigator();
const DrawerNav = createDrawerNavigator();

enableScreens();

export default function Main(props) {
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

  const AuthenticatedNavigation = (
    <View style={{flex: 1}}>
      <NavigationContainer
        linking={linking}
        fallback={<Text>Loading...</Text>}
        ref={navigationRef}>
        <DrawerNav.Navigator
          initialRouteName="Home"
          drawerContentOptions={{
            activeTintColor: '#e91e63',
            itemStyle: {marginVertical: 5},
            activeBackgroundColor: '#ffe',
          }}>
          <DrawerNav.Screen
            name="Home"
            component={HomeNavigation}
            title="Home"
          />
          <DrawerNav.Screen
            name="Create Community"
            component={CreateCommunity}
            title="Create Community"
          />
          {props.auth_state == 'AUTHENTICATED' ? (
            <DrawerNav.Screen
              name="My Account"
              component={MyAccount}
              title="MyAccount"
            />
          ) : (
            <DrawerNav.Screen
              name="Signin"
              component={UnauthenticatedNavigation}
              title="Signin"
            />
          )}
        </DrawerNav.Navigator>
      </NavigationContainer>
    </View>
  );

  function UnauthenticatedNavigation() {
    return (
      <StackNav.Navigator
        initialRouteName="SignIn"
        screenOptions={
          {
            //  headerShown: false,
          }
        }>
        <StackNav.Screen name="SignIn" component={SignIn} title="SignIn" />
        <StackNav.Screen
          name="CreateAccount"
          component={CreateAccount}
          title="CreateAccount"
        />
      </StackNav.Navigator>
    );
  }

  const LoadingNavigation = (
    <NavigationContainer>
      <StackNav.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <StackNav.Screen name="Splash" component={Splash} title="Splash" />
      </StackNav.Navigator>
    </NavigationContainer>
  );

  return props.auth_state == 'AUTHENTICATED'
    ? AuthenticatedNavigation
    : props.auth_state == 'UNAUTHENTICATED'
    ? AuthenticatedNavigation
    : AuthenticatedNavigation;
}
