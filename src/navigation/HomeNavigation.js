import React from 'react';
import {View, FlatList, Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import CreatePostButtonOverlay from '../components/Post/CreatePostButtonOverlay';
import AccountNavigation from '../screens/account/AccountNavigation';
import CommunityNavigation from '../screens/community/CommunityNavigation';
import HeaderBar from '../components/Header';
import Home from '../screens/home/tabs/Home';
//import Popular from '../screens/home/tabs/Popular';
import CreatePost from '../screens/create/CreatePost';
import PostDetail from '../screens/PostDetail';

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
  Platform.OS == 'ios'
    ? TransitionPresets.SlideFromRightIOS
    : TransitionPresets.ScaleFromCenterAndroid;

function HomeNavigation({navigation}) {
  return (
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
        name="Account"
        component={AccountNavigation}
        title="Account"
      />
      <StackNav.Screen
        name="CreatePost"
        component={CreatePost}
        title="Create Post"
        options={{
          headerTitle: 'Create Post',
          headerBackTitle: '',
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
    </StackNav.Navigator>
  );
}

export default HomeNavigation;
