import React from 'react';
import {View, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import CreatePostButtonOverlay from '../../components/CreatePostButtonOverlay';

import Account from '../account/Account';
import Community from '../community/Community';

import HeaderBar from '../../components/Header';
import Home from './tabs/Home';
import Popular from './tabs/Popular';
import CreatePost from '../create/CreatePost';
import TabBarNavigator from '../../components/TabBarNavigator';

const Tab = createMaterialTopTabNavigator();
const StackNav = createStackNavigator();

function HomeTabNavigation({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        //  tabBar={props => <TabBarNavigator {...props} />}
        tabBarOptions={{
          activeTintColor: '#444',
          inactiveTintColor: 'grey',
          showIcon: true,
          labelStyle: {
            width: '100%',
            fontWeight: 'bold',
            fontSize: 13,
          },
          tabStyle: {
            justifyContent: 'flex-start',
            padding: 0,
          },
          style: {
            height: 35,
          },
        }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Popular" component={Popular} />
      </Tab.Navigator>
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
      <StackNav.Screen name="Home" component={HomeTabNavigation} title="Home" />
      <StackNav.Screen
        name="Community"
        component={Community}
        title="Community"
      />
      <StackNav.Screen name="Account" component={Account} title="Account" />
      <StackNav.Screen
        name="CreatePost"
        component={CreatePost}
        title="Create Post"
      />
    </StackNav.Navigator>
  );
}

export default HomeStackNavigation;
