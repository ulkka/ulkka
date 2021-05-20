import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import HomeCollapsibleTabView from './HomeCollapsibleTabView';
import SearchScreen from './SearchScreen';
import HeaderBar from '../../components/Header';
import SearchBar from '../../components/Search';

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
          ...presets,
        }}>
        <StackNav.Screen
          name="HomeFeed"
          component={HomeCollapsibleTabView}
          title="Home"
          options={{header: () => <HeaderBar />}}
        />
        <StackNav.Screen
          name="Search"
          component={SearchScreen}
          title="Search"
          options={{header: () => <SearchBar />}}
        />
      </StackNav.Navigator>
    </View>
  );
}

export default FeedNavigation;
