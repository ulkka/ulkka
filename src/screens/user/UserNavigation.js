import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import UserDetailTabView from './UserDetailTabView';
import BlockedUsers from './BlockedUsers';
import UserCommunities from './UserCommunitiesTabView';

const StackNav = createStackNavigator();

function UserNavigation(props) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <StackNav.Navigator
        initialRouteName="UserDetailTabView"
        screenOptions={{
          headerBackTitle: 'Back',
          ...(Platform.OS == 'android' && {
            headerTitleStyle: {fontSize: 15, color: '#555'},
            headerStyle: {height: 40},
          }),
        }}>
        <StackNav.Screen
          name="UserDetailTabView"
          component={UserDetailTabView}
          title="UserDetailTabView"
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
