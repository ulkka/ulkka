import React, {useEffect, useState, memo} from 'react';
import {View, TouchableOpacity, Keyboard, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getRegistrationStatus} from '../redux/reducers/AuthSlice';
import {showCreatorOverlay} from '../redux/reducers/CreatorOverlaySlice';
import {showAuthScreen} from './Ref';
import {Badge} from 'react-native-elements';
import {
  getFocusedRouteNameFromRoute,
  getPathFromState,
} from '@react-navigation/native';

function MainBottomTabBar({state, descriptors, navigation}) {
  const dispatch = useDispatch();
  const isRegistered = useSelector(getRegistrationStatus);
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const [hidden, setHidden] = useState(false);

  let communityId = '';

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setHidden(true);
  };
  const _keyboardDidHide = () => {
    setHidden(false);
  };
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return hidden ? (
    <View />
  ) : (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopColor: '#f5f5f5',
        borderTopWidth: 1,
        alignItems: 'center',
        paddingVertical: 8,
        ...(Platform.OS == 'ios' && {paddingBottom: 25}),
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const focusedRouteName = getFocusedRouteNameFromRoute(route);
        if (isFocused && focusedRouteName == 'CommunityNavigation') {
          const path = route.state && getPathFromState(route.state);
          communityId = path.split('=')[1];
        }
        const {
          requireAuth,
          tabBarIcon: icon,
          activeTabBarIcon,
          tabBarBadge,
        } = options;

        const onPress = () => {
          if (requireAuth && !isRegistered) {
            showAuthScreen();
          } else {
            if (route.name == 'CreatePost') {
              if (communityId) {
                dispatch(showCreatorOverlay(communityId));
              } else {
                dispatch(showCreatorOverlay());
              }
            } else {
              setHidden(route.name == 'Search');
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
            }}>
            {tabBarBadge ? (
              <Badge
                status="error"
                value={tabBarBadge}
                textStyle={{fontSize: 10}}
                containerStyle={{
                  position: 'absolute',
                  // borderWidth: 1,
                  top: -10,
                  right: 25,
                  // width: 30,
                }}
              />
            ) : null}
            {isFocused
              ? activeTabBarIcon
                ? activeTabBarIcon({color: isFocused ? '#333' : '#888'})
                : icon({color: isFocused ? '#333' : '#888'})
              : icon({color: isFocused ? '#333' : '#888'})}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default memo(MainBottomTabBar);
