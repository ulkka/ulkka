import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {
  NavigationContainer,
  // getStateFromPath,
  // getPathFromState,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderStyleInterpolators,
  TransitionPresets,
  TransitionSpecs,
} from '@react-navigation/stack';

import {enableScreens} from 'react-native-screens';

import MyAccount from '../screens/home/MyAccount';
import Splash from '../screens/Splash';

import Login from '../screens/auth/Login';
import {navigationRef} from './Ref';
import HomeNavigation from './HomeNavigation';
import CreateCommunity from '../screens/create/CreateCommunity';
import RegisterAccount from '../screens/auth/RegisterAccount';
import {
  getAuthStatus,
  getRegistrationStatus,
} from '../redux/reducers/AuthSlice';
import {useSelector, useDispatch} from 'react-redux';
import {loadAuth} from '../redux/actions/AuthActions';
import {useReduxDevToolsExtension} from '@react-navigation/devtools';

const StackNav = createStackNavigator();
const DrawerNav = createDrawerNavigator();

enableScreens();

export default function Main(props) {
  const dispatch = useDispatch();
  useReduxDevToolsExtension(navigationRef);
  // const authStatus = useSelector(getAuthStatus);
  // const isRegistered = useSelector(getRegistrationStatus);

  useEffect(() => {
    dispatch(loadAuth());
  }, []);

  const config = {
    screens: {
      Main: {
        screens: {
          Home: {
            screens: {
              CreatePost: 'create/post',
              PostDetail: 'postdetail',
              Feed: {
                screens: {
                  Home: 'home',
                  Popular: 'popular',
                },
              },
              Community: 'community',
              Account: 'account',
            },
          },
          'Create Community': 'create/community',
          'My Account': 'myaccount',
          'Login / Register': 'login',
        },
      },
      Signup: 'signup',
    },
  };

  const linking = {
    prefixes: [
      'https://app.vellarikkapattanam.com',
      'https://vellarikkapattanam.com',
      'vellarikkapattanam://',
      'https://vellarikkapattanam.page.link',
      'https://vellarikka-pattanam.firebaseapp.com',
    ],
    config,
  };

  const SigninNavigation = () => {
    return (
      <StackNav.Navigator
        initialRouteName={'Login'}
        screenOptions={{
          headerStyle: {
            borderTopWidth: 1,
            borderTopColor: '#ddd',
            borderTopEndRadius: 15,
            borderTopStartRadius: 15,
          },
        }}>
        <StackNav.Screen
          options={{headerBackTitle: ''}}
          name={
            'Login'
            // authStatus != 'AUTHENTICATED' ? 'Login' : 'Register Account'
          }
          component={Login}
          title={'Login'}
        />
      </StackNav.Navigator>
    );
  };

  const UserNavigation =
    //   isRegistered == 1 ? (
    1 ? (
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

  const MainNavigator = () => {
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
        {
          //  UserNavigation
        }
        <DrawerNav.Screen
          name="My Account"
          component={MyAccount}
          title="MyAccount"
        />
        <DrawerNav.Screen
          name="Login / Register"
          component={SigninNavigation}
          title="Login / Register"
          options={{
            animationEnabled: true,
          }}
        />
      </DrawerNav.Navigator>
    );
  };

  const SignupModal = (
    //  isRegistered == 0 ? (
    <StackNav.Screen
      name="Signup"
      component={SigninNavigation}
      title="Signup"
      options={{
        headerShown: false,
        cardStyle: {
          paddingTop: 25,
          backgroundColor: 'white',
          /*    shadowColor: '#000',
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowOpacity: 0.7,
          shadowRadius: 5,*/
        },
      }}
    />
  );
  // ) : null;

  const LoadingNavigation = (
    <NavigationContainer linking={linking}>
      <StackNav.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <StackNav.Screen name="Splash" component={Splash} title="Splash" />
      </StackNav.Navigator>
    </NavigationContainer>
  );

  const AppNavigation = (
    <NavigationContainer
      linking={linking}
      fallback={<Splash />}
      ref={navigationRef}>
      <StackNav.Navigator
        initialRouteName="Main"
        screenOptions={() => ({
          gestureEnabled: true,
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        })}
        mode="modal">
        <StackNav.Screen
          name="Main"
          component={MainNavigator}
          title="Home"
          options={{
            headerShown: false,
          }}
        />
        {
          //  SignupModal
        }
        <StackNav.Screen
          name="Signup"
          component={Login}
          title="Signup"
          options={{
            headerBackTitle: '',
            headerStatusBarHeight: 0,
          }}
        />
      </StackNav.Navigator>
    </NavigationContainer>
  );

  //return authStatus == 'UNAUTHENTICATED' ? LoadingNavigation : AppNavigation;
  return AppNavigation;
}
