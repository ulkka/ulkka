import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import Splash from '../screens/Splash';
import {navigationRef} from './Ref';
import {linking} from './Linking';
import HomeNavigation from './HomeNavigation';
import {AuthNavigation, getRouteName} from './AuthNavigation';
import CreateCommunity from '../screens/create/CreateCommunity';
import {useDispatch} from 'react-redux';
import {loadAuth} from '../redux/actions/AuthActions';
import {useReduxDevToolsExtension} from '@react-navigation/devtools';

const StackNav = createStackNavigator();
const DrawerNav = createDrawerNavigator();

enableScreens();

export default function Main(props) {
  const dispatch = useDispatch();
  useReduxDevToolsExtension(navigationRef);

  useEffect(() => {
    dispatch(loadAuth());
  }, []);

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
        <DrawerNav.Screen
          name={'My Account'}
          component={AuthNavigation}
          title={'My Account'}
        />
      </DrawerNav.Navigator>
    );
  };

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
        <StackNav.Screen
          name={'Authentication'}
          component={AuthNavigation}
          title={'Authentication'}
          options={{
            headerShown: false,
          }}
        />
      </StackNav.Navigator>
    </NavigationContainer>
  );

  return AppNavigation;
}
