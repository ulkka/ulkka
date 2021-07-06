import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import HomeCollapsibleTabView from './HomeCollapsibleTabView';
import UserNavigation from '../user/UserNavigation';
import CommunityNavigation from '../community/CommunityNavigation';
import PostDetail from '../PostDetail';
import CreateCommunity from '../create/CreateCommunity';
import DrawerContent from '../../navigation/DrawerContent';
import {createDrawerNavigator} from '@react-navigation/drawer';

const StackNav = createStackNavigator();
const Drawer = createDrawerNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.ScaleFromCenterAndroid
    : TransitionPresets.SlideFromRightIOS;

function DrawerNavigation() {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={DrawerContent}>
      <Drawer.Screen name="Home" component={HomeCollapsibleTabView} />
    </Drawer.Navigator>
  );
}

function FeedNavigation() {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StackNav.Navigator
        initialRouteName="HomeFeed"
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
          name="HomeFeed"
          component={DrawerNavigation}
          title="Home"
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

export default FeedNavigation;
