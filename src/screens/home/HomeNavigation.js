import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import CreatePostButtonOverlay from '../../components/CreatePostButtonOverlay';

import AccountNavigation from '../account/AccountNavigation';
import CommunityNavigation from '../community/CommunityNavigation';

import HeaderBar from '../../components/Header';
import Home from './tabs/Home';
import Popular from './tabs/Popular';
import CreatePost from '../create/CreatePost';
import PostDetail from '../PostDetail';

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
        <Tab.Screen name="Popular" component={Popular} />
      </Tab.Navigator>
    </View>
  );
}

function HomeList({navigation}) {
  return (
    <View style={{flex: 1}}>
      <FlatList ListFooterComponent={HomeTabNavigation} />
      <CreatePostButtonOverlay navigation={navigation} />
    </View>
  );
}

function HomeStackNavigation({navigation}) {
  return (
    <StackNav.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: () => <HeaderBar navigation={navigation} />,
      }}>
      <StackNav.Screen name="Home" component={HomeList} title="Home" />
      <StackNav.Screen
        name="Community"
        component={CommunityNavigation}
        title="Community"
      />
      <StackNav.Screen
        name="Account"
        component={AccountNavigation}
        title="Account"
      />
      <StackNav.Screen
        name="CreatePost"
        component={CreatePost}
        title="Create Post"
      />
      <StackNav.Screen
        name="PostDetail"
        component={PostDetail}
        title="Post Detail"
      />
    </StackNav.Navigator>
  );
}

export default HomeStackNavigation;
