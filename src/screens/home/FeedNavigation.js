import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import HomeCollapsibleTabView from './HomeCollapsibleTabView';
import SearchScreen from './SearchScreen';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';

const StackNav = createStackNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.FadeFromBottomAndroid
    : TransitionPresets.SlideFromRightIOS;

function FeedNavigation(props) {
  return (
    <View style={{flex: 1}}>
      <StackNav.Navigator
        initialRouteName="HomeFeed"
        screenOptions={{...presets}}>
        <StackNav.Screen
          name="HomeFeed"
          component={HomeCollapsibleTabView}
          title="Home"
          options={{
            headerShown: false,
          }}
        />
        <StackNav.Screen
          name="Search"
          component={SearchScreen}
          title="Search"
          options={{
            headerShown: false,
          }}
        />
      </StackNav.Navigator>
    </View>
  );
}

export default FeedNavigation;
