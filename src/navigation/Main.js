import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import {navigationRef} from './Ref';
import {linking} from './Linking';
import HomeNavigation from './HomeNavigation';
import {AuthNavigation} from './AuthNavigation';
import Splash from '../screens/Splash';
import CreateCommunity from '../screens/create/CreateCommunity';
import {useDispatch} from 'react-redux';
import {loadAuth} from '../redux/actions/AuthActions';
import {useReduxDevToolsExtension} from '@react-navigation/devtools';

const StackNav = createStackNavigator();

enableScreens();

export default function Main() {
  const dispatch = useDispatch();
  useReduxDevToolsExtension(navigationRef);

  useEffect(() => {
    dispatch(loadAuth());
  }, []);

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
          component={HomeNavigation}
          title="Home"
          options={{
            headerShown: false,
          }}
        />
        <StackNav.Screen
          name={'Authentication'}
          component={AuthNavigation}
          title={'Authentication'}
          options={{
            headerShown: false,
          }}
        />
        <StackNav.Screen
          name={'Create Community'}
          component={CreateCommunity}
          title={'Create Community'}
          options={{
            headerShown: false,
          }}
        />
      </StackNav.Navigator>
    </NavigationContainer>
  );

  return AppNavigation;
}
