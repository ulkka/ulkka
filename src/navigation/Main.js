import React, {useEffect, useRef} from 'react';
import {Platform, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import analytics from '@react-native-firebase/analytics';
import {enableScreens} from 'react-native-screens';
import {navigationRef} from './Ref';
import {linking} from './Linking';
import HomeNavigation from './HomeNavigation';
import {AuthNavigation} from './AuthNavigation';
import Splash from '../screens/Splash';
import CreateCommunity from '../screens/create/CreateCommunity';
import {useDispatch, useSelector} from 'react-redux';
import {loadAuth} from '../redux/actions/AuthActions';
import {getAuthStatus} from '../redux/reducers/AuthSlice';

//import {useReduxDevToolsExtension} from '@react-navigation/devtools';

const StackNav = createStackNavigator();

enableScreens();

export default function Main() {
  const dispatch = useDispatch();
  // useReduxDevToolsExtension(navigationRef);
  const authStatus = useSelector(getAuthStatus);

  const routeNameRef = useRef();

  useEffect(() => {
    dispatch(loadAuth());
  }, []);

  const presets =
    Platform.OS == 'ios'
      ? TransitionPresets.ModalPresentationIOS
      : TransitionPresets.RevealFromBottomAndroid;

  const AppNavigation = (
    <View style={{flex: 1}}>
      {authStatus == 'UNAUTHENTICATED' ? (
        <NavigationContainer>
          <StackNav.Navigator initialRouteName="Splash">
            <StackNav.Screen
              name="Splash"
              component={Splash}
              title="Splash"
              options={{
                headerShown: false,
              }}
            />
          </StackNav.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer
          linking={linking}
          //  fallback={<Splash />}
          ref={navigationRef}
          onReady={async () => {
            const currentRouteName = navigationRef.current.getCurrentRoute()
              .name;
            routeNameRef.current = currentRouteName;
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current.getCurrentRoute()
              .name;
            if (previousRouteName !== currentRouteName) {
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName,
              });
            }

            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;
          }}>
          <StackNav.Navigator
            initialRouteName="Main"
            screenOptions={() => ({
              // cardStyle: {backgroundColor: 'transparent'},
              gestureEnabled: true,
              cardOverlayEnabled: true,
              ...TransitionPresets.ScaleFromCenterAndroid,
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
                gestureEnabled: true,
                cardOverlayEnabled: true,
                ...presets,
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
      )}
    </View>
  );

  return AppNavigation;
}
