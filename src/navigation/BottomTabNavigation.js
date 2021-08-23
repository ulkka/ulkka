import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {Icon, ThemeContext} from 'react-native-elements';
import CreatePost from '../screens/create/PostCreator';
import {useSelector} from 'react-redux';
import FeedNavigation from '../screens/home/FeedNavigation';
import SearchNavigation from './SearchNavigation';
import NotificationNavigation from './NotificationNavigation';
import MainBottomTabBar from './MainBottomTabBar';
import {getUnreadNotificationCount} from '../redux/reducers/NotificationSlice';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigation() {
  const {theme} = useContext(ThemeContext);

  const unReadNotificationCount = useSelector(getUnreadNotificationCount);

  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'PostDetail') {
      return false;
    }
    return true;
  };

  return (
    <BottomTab.Navigator tabBar={props => <MainBottomTabBar {...props} />}>
      <BottomTab.Screen
        name="Home"
        component={FeedNavigation}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          requireAuth: false,
          tabBarIcon: ({color, size}) => (
            <Icon
              name="home-outline"
              color={color}
              size={29}
              type="material-community"
            />
          ),
          activeTabBarIcon: ({color, size}) => (
            <Icon
              name="home"
              color={color}
              size={29}
              type="material-community"
            />
          ),
        })}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchNavigation}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          requireAuth: false,
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <Icon name="search" color={color} size={26} />
          ),
          activeTabBarIcon: ({color, size}) => (
            <Icon name="search" type="font-awesome" color={color} size={22} />
          ),
        })}
      />
      <BottomTab.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          requireAuth: true,
          tabBarVisible: false,
          tabBarIcon: ({color, size}) => (
            <Icon
              name="plus"
              type="material-community"
              color={color}
              size={28}
            />
          ),
          activeTabBarIcon: ({color, size}) => (
            <Icon name="plus" type="font-awesome" color={color} size={23} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationNavigation}
        options={{
          requireAuth: true,
          tabBarBadge: unReadNotificationCount,
          tabBarIcon: ({color, size}) => (
            <Icon name={'bell-o'} type="font-awesome" color={color} size={20} />
          ),
          activeTabBarIcon: ({color, size}) => (
            <Icon name="bell" type="font-awesome" color={color} size={20} />
          ),
        }}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
          unmountOnBlur: true,
          requireAuth: true,
          tabBarBadge: unReadNotificationCount,
          tabBarIcon: ({color, size}) => (
            <Icon name="bell-o" type="font-awesome" color={color} size={20} />
          ),
          activeTabBarIcon: ({color, size}) => (
            <Icon name="bell" type="font-awesome" color={color} size={20} />
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}
