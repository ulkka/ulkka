import React from 'react';
import {View, Platform} from 'react-native';
import {useTheme} from 'react-native-elements';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import UserNavigation from '../screens/user/UserNavigation';
import CommunityNavigation from '../screens/community/CommunityNavigation';
import Notifications from '../screens/Notifications';
import PostDetail from '../screens/PostDetail';
import {useTranslation} from 'react-i18next';

const StackNav = createStackNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.ScaleFromCenterAndroid
    : TransitionPresets.SlideFromRightIOS;

function NotificationNavigation() {
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <StackNav.Navigator
        initialRouteName="Notifications"
        screenOptions={{
          headerBackTitle: 'Back',
          headerShown: false,
          headerTitleAlign: 'center',
          ...(Platform.OS == 'android' && {
            headerTitleStyle: {fontSize: 15},
            headerStyle: {height: 40},
          }),
          ...presets,
        }}>
        <StackNav.Screen
          name="Notifications"
          component={Notifications}
          title="Notifications"
          options={{headerShown: true, headerTitle: t('Notifications')}}
        />
        <StackNav.Screen
          name="CommunityNavigation"
          component={CommunityNavigation}
          title="CommunityNavigation"
        />
        <StackNav.Screen
          name="UserDetail"
          component={UserNavigation}
          title="UserDetail"
        />
        <StackNav.Screen
          name="PostDetail"
          component={PostDetail}
          title="Post Detail"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: '',
            headerBackTitleStyle: {
              fontSize: 16,
            },
          }}
        />
      </StackNav.Navigator>
    </View>
  );
}

export default NotificationNavigation;
