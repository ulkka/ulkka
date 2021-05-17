import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import UserDetailTabView from '../screens/user/UserDetailTabView';
import CommunityDetailTabView from '../screens/community/CommunityDetailTabView';
import CommunityNavigation from '../screens/community/CommunityNavigation';

import HeaderBar from '../components/Header';
import CreatePost from '../screens/create/PostCreator';
import CreateCommunity from '../screens/create/CreateCommunity';
import PostDetail from '../screens/PostDetail';
import {useSelector} from 'react-redux';
import {isVisible} from '../redux/reducers/OptionSheetSlice';
import OptionSheet from '../components/OptionSheet';
import BlockedUsers from '../screens/user/BlockedUsers';
import Notifications from '../screens/Notifications';
import EmailLinkHandler from '../screens/auth/EmailLinkHandler';
import HomeCollapsibleTabView from '../components/HomeCollapsibleTabView';
import ShareMenuHandler from '../components/ShareMenuHandler';
import {
  NotificationHandler,
  ConfigurePushNotification,
} from '../components/NotificationHandler';
import {getRegistrationStatus} from '../redux/reducers/AuthSlice';
import Popular from '../screens/home/tabs/Popular';

const StackNav = createStackNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.ScaleFromCenterAndroid
    : TransitionPresets.SlideFromRightIOS;

function HomeNavigation({navigation}) {
  const isOptionSheetVisible = useSelector(isVisible);
  const isRegistered = useSelector(getRegistrationStatus);

  const feedScreen = isRegistered ? HomeCollapsibleTabView : Popular;

  return (
    <View style={{flex: 1}}>
      <StackNav.Navigator
        initialRouteName="Feed"
        screenOptions={{
          headerStyle:
            Platform.OS == 'android'
              ? {
                  height: 40,
                }
              : {},
          headerTitleStyle: {
            fontSize: Platform.OS == 'ios' ? 17 : 15,
            color: '#444',
          },
          ...presets,
        }}>
        <StackNav.Screen
          name="Feed"
          component={feedScreen}
          title="Home"
          options={{
            header: () => <HeaderBar navigation={navigation} />,
          }}
        />
        <StackNav.Screen
          name="CommunityNavigation"
          component={CommunityNavigation}
          title="CommunityNavigation"
          options={{
            headerShown: false,
          }}
        />
        <StackNav.Screen
          name="UserDetail"
          component={UserDetailTabView}
          title="UserDetail"
          options={{
            headerBackTitle: 'Back',
            headerTitle: '',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
          }}
        />
        <StackNav.Screen
          name="CreatePost"
          component={CreatePost}
          title="Create Post"
          options={{
            headerTitle: 'Create Post',
            headerBackTitle: '',
            headerTitleAlign: 'center',
          }}
        />
        <StackNav.Screen
          name="PostDetail"
          component={PostDetail}
          title="Post Detail"
          options={{
            headerTitle: '',
            headerBackTitle: '',
            headerBackTitleStyle: {
              fontSize: 16,
            },
          }}
        />
        <StackNav.Screen
          name="BlockedUsers"
          component={BlockedUsers}
          title="Blocked Users"
          options={{
            headerTitle: 'Blocked Users',
            headerBackTitle: '',
            headerBackTitleStyle: {
              fontSize: 16,
            },
            headerTitleAlign: 'center',
          }}
        />
        <StackNav.Screen
          name="Notifications"
          component={Notifications}
          title="Notifications"
          options={{
            headerTitle: 'Notifications',
            headerBackTitle: '',
            headerBackTitleStyle: {
              fontSize: 16,
            },
            headerTitleAlign: 'center',
          }}
        />
        <StackNav.Screen
          name={'Create Community'}
          component={CreateCommunity}
          title={'Create Community'}
          options={{
            //headerShown: false,
            headerTitleAlign: 'center',
          }}
        />
      </StackNav.Navigator>
      {isOptionSheetVisible && <OptionSheet />}
      <EmailLinkHandler />
      <ShareMenuHandler />
      <ConfigurePushNotification />
      <NotificationHandler />
    </View>
  );
}

export default HomeNavigation;
