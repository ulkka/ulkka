import React, {useContext} from 'react';
import {View, Platform} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import SearchScreen from '../screens/home/SearchScreen';
import UserNavigation from '../screens/user/UserNavigation';
import CommunityNavigation from '../screens/community/CommunityNavigation';
import PostDetail from '../screens/PostDetail';

const StackNav = createStackNavigator();

const presets =
  Platform.OS == 'android'
    ? TransitionPresets.ScaleFromCenterAndroid
    : TransitionPresets.SlideFromRightIOS;

function SearchNavigation() {
  const {theme} = useContext(ThemeContext);

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <StackNav.Navigator
        initialRouteName="SearchScreen"
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
          name="Search"
          component={SearchScreen}
          title="Search"
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

export default SearchNavigation;
