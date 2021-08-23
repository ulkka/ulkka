import React from 'react';
import {View, Platform} from 'react-native';
import {useTheme} from 'react-native-elements';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import CreatePost from '../screens/create/PostCreator';
import CreateCommunity from '../screens/create/CreateCommunity';
import {useSelector} from 'react-redux';
import {isVisible} from '../redux/reducers/OptionSheetSlice';
import OptionSheet from '../components/OptionSheet';
import {getCommunityCreatorPromptIsVisble} from '../redux/reducers/CommunityCreatorPromptSlice';
import {CommunityCreatorPromptOverlay} from '../components/CommunityCreatorPrompt';
import EmailLinkHandler from '../screens/auth/EmailLinkHandler';
import ShareMenuHandler from '../components/ShareMenuHandler';
import {
  NotificationHandler,
  ConfigurePushNotification,
} from '../components/NotificationHandler';
import CreatePostButtonOverlay from '../components/Post/CreatePostButtonOverlay';
import BottomTabNavigation from './BottomTabNavigation';
import PostDetail from '../screens/PostDetail';
import CommunityNavigation from '../screens/community/CommunityNavigation';
import ImageZoomer from '../components/Post/ImageZoomer';
import ReviewRequestComponent from '../components/ReviewRequestComponent';

const StackNav = createStackNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.ScaleFromCenterAndroid
    : TransitionPresets.SlideFromRightIOS;

function HomeNavigation() {
  const {theme} = useTheme();

  const isOptionSheetVisible = useSelector(isVisible);
  const isCommunityCreatorPromptVisible = useSelector(
    getCommunityCreatorPromptIsVisble,
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
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
        <StackNav.Screen
          name="Feed"
          component={BottomTabNavigation}
          title="Home"
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
          name="CommunityNavigation"
          component={CommunityNavigation}
          title="CommunityNavigation"
        />
        <StackNav.Screen
          name="ImageZoomer"
          component={ImageZoomer}
          title="ImageZoomer"
          options={{
            ...TransitionPresets.ScaleFromCenterAndroid,
          }}
        />
      </StackNav.Navigator>
      {isOptionSheetVisible && <OptionSheet />}
      {isCommunityCreatorPromptVisible && <CommunityCreatorPromptOverlay />}
      <EmailLinkHandler />
      <ShareMenuHandler />
      <ConfigurePushNotification />
      <NotificationHandler />
      <CreatePostButtonOverlay />
      <ReviewRequestComponent />
    </View>
  );
}

export default HomeNavigation;
