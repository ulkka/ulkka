import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import UserDetailTabView from './UserDetailTabView';
import BlockedUsers from './BlockedUsers';
import UserCommunities from './UserCommunitiesTabView';

const StackNav = createStackNavigator();

function UserNavigation(props) {
  const {userId} = props.route.params;

  return (
    <View style={{flex: 1}}>
      <StackNav.Navigator
        initialRouteName="CommunityDetail"
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
        }}>
        <StackNav.Screen
          name="UserDetailTabView"
          component={UserDetailTabView}
          title="UserDetailTabView"
          options={{
            headerBackTitle: 'Back',
            headerTitle: '',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
          }}
          initialParams={props.route.params}
        />
        <StackNav.Screen
          name="BlockedUsers"
          component={BlockedUsers}
          title="Blocked Users"
          options={{
            headerTitle: 'Blocked Users',
            headerBackTitle: '',
            headerBackTitleStyle: {
              fontSize: 16,
            },
            headerTitleAlign: 'center',
          }}
        />
        <StackNav.Screen
          name="UserCommunities"
          component={UserCommunities}
          title="My Communities"
          options={{
            headerTitle: 'My Communities',
            headerBackTitle: '',
            headerBackTitleStyle: {
              fontSize: 16,
            },
            headerTitleAlign: 'center',
          }}
        />
      </StackNav.Navigator>
    </View>
  );
}

export default UserNavigation;
