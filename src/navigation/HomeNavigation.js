import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import UserNavigation from '../screens/user/UserNavigation';
import CommunityNavigation from '../screens/community/CommunityNavigation';
import CreatePost from '../screens/create/PostCreator';
import CreateCommunity from '../screens/create/CreateCommunity';
import PostDetail from '../screens/PostDetail';
import {useSelector} from 'react-redux';
import {isVisible} from '../redux/reducers/OptionSheetSlice';
import OptionSheet from '../components/OptionSheet';
import Notifications from '../screens/Notifications';
import EmailLinkHandler from '../screens/auth/EmailLinkHandler';
import FeedNavigation from '../screens/home/FeedNavigation';
import ShareMenuHandler from '../components/ShareMenuHandler';
import {
  NotificationHandler,
  ConfigurePushNotification,
} from '../components/NotificationHandler';
import CreatePostButtonOverlay from '../components/Post/CreatePostButtonOverlay';

const StackNav = createStackNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.ScaleFromCenterAndroid
    : TransitionPresets.SlideFromRightIOS;

function HomeNavigation() {
  const isOptionSheetVisible = useSelector(isVisible);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StackNav.Navigator
        initialRouteName="Feed"
        screenOptions={() => ({
          headerBackTitle: 'Back',
          headerShown: false,
          headerTitleAlign: 'center',
          ...(Platform.OS == 'android' && {
            headerTitleStyle: {fontSize: 15},
            headerStyle: {height: 40},
          }),
          ...presets,
        })}>
        <StackNav.Screen name="Feed" component={FeedNavigation} title="Home" />
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
        <StackNav.Screen
          name="Notifications"
          component={Notifications}
          title="Notifications"
          options={{
            headerShown: true,
            headerTitle: 'Notifications',
            headerBackTitle: '',
            headerBackTitleStyle: {
              fontSize: 16,
            },
            headerTitleAlign: 'center',
          }}
        />
        <StackNav.Screen
          name="CreatePost"
          component={CreatePost}
          title="Create Post"
          options={{
            headerShown: true,
            headerTitle: 'Create Post',
            headerBackTitle: '',
            headerTitleAlign: 'center',
          }}
        />
        <StackNav.Screen
          name={'Create Community'}
          component={CreateCommunity}
          title={'Create Community'}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
          }}
        />
      </StackNav.Navigator>
      {isOptionSheetVisible && <OptionSheet />}
      <EmailLinkHandler />
      <ShareMenuHandler />
      <ConfigurePushNotification />
      <NotificationHandler />
      <CreatePostButtonOverlay />
    </View>
  );
}

export default HomeNavigation;
