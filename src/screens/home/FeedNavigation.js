import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import HomeCollapsibleTabView from './HomeCollapsibleTabView';
import Search from './Search';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';
import Popular from './tabs/Popular';

const StackNav = createStackNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.FadeFromBottomAndroid
    : TransitionPresets.SlideFromRightIOS;

function FeedNavigation(props) {
  const isRegistered = useSelector(getRegistrationStatus);

  const feedScreen = isRegistered ? HomeCollapsibleTabView : Popular;

  return (
    <View style={{flex: 1}}>
      <StackNav.Navigator
        initialRouteName="HomeFeed"
        screenOptions={{...presets}}>
        <StackNav.Screen
          name="HomeFeed"
          component={feedScreen}
          title="Home"
          options={{
            headerShown: false,
          }}
        />
        <StackNav.Screen
          name="Search"
          component={Search}
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
