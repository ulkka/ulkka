import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import HomeCollapsibleTabView from './HomeCollapsibleTabView';
import SearchScreen from './SearchScreen';
import HeaderBar from '../../components/Header';

const StackNav = createStackNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.FadeFromBottomAndroid
    : TransitionPresets.ScaleFromCenterAndroid;

function FeedNavigation() {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StackNav.Navigator
        initialRouteName="HomeFeed"
        screenOptions={{
          header: () => <HeaderBar />,
          ...presets,
        }}>
        <StackNav.Screen
          name="HomeFeed"
          component={HomeCollapsibleTabView}
          title="Home"
        />
        <StackNav.Screen
          name="Search"
          component={SearchScreen}
          title="Search"
        />
      </StackNav.Navigator>
    </View>
  );
}

export default FeedNavigation;
