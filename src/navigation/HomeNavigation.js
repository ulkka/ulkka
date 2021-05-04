import React from 'react';
import {View, FlatList, Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import CreatePostButtonOverlay from '../components/Post/CreatePostButtonOverlay';
import UserDetail from '../screens/user/UserDetail';
import CommunityNavigation from '../screens/community/CommunityNavigation';
import HeaderBar from '../components/Header';
import Home from '../screens/home/tabs/Home';
//import Popular from '../screens/home/tabs/Popular';
import CreatePost from '../screens/create/PostCreator';
import PostDetail from '../screens/PostDetail';
import {useSelector} from 'react-redux';
import {isVisible} from '../redux/reducers/OptionSheetSlice';
import OptionSheet from '../components/OptionSheet';
import BlockedUsers from '../screens/user/BlockedUsers';
import Notifications from '../screens/Notifications';
import EmailLinkHandler from '../screens/auth/EmailLinkHandler';

const Tab = createMaterialTopTabNavigator();
const StackNav = createStackNavigator();

function HomeTabNavigation({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#444',
          inactiveTintColor: 'grey',
          showIcon: true,
          labelStyle: {
            width: '100%',
            fontWeight: 'bold',
            fontSize: 13,
          },
        }}>
        <Tab.Screen name="Home" component={Home} />
        {
          //<Tab.Screen name="Popular" component={Popular} />
        }
      </Tab.Navigator>
    </View>
  );
}

function FeedList({navigation}) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList listKey="feed" ListFooterComponent={HomeTabNavigation} />
      <CreatePostButtonOverlay />
    </View>
  );
}

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.ScaleFromCenterAndroid
    : TransitionPresets.SlideFromRightIOS;

function HomeNavigation({navigation}) {
  const isOptionSheetVisible = useSelector(isVisible);

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
          component={Home}
          title="Home"
          options={{
            header: () => <HeaderBar navigation={navigation} />,
          }}
        />
        <StackNav.Screen
          name="Community"
          component={CommunityNavigation}
          title="Community"
        />
        <StackNav.Screen
          name="UserDetail"
          component={UserDetail}
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
      </StackNav.Navigator>
      {isOptionSheetVisible && <OptionSheet />}
      <EmailLinkHandler />
    </View>
  );
}

export default HomeNavigation;
