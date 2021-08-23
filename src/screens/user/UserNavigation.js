import React, {useContext} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import UserDetailTabView from './UserDetailTabView';
import BlockedUsers from './BlockedUsers';

const StackNav = createStackNavigator();

function UserNavigation(props) {
  const {theme} = useContext(ThemeContext);

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <StackNav.Navigator
        initialRouteName="UserDetailTabView"
        screenOptions={{
          headerBackTitle: 'Back',
          ...(Platform.OS == 'android' && {
            headerTitleStyle: {fontSize: 15, color: theme.colors.black5},
            headerStyle: {height: 40},
          }),
        }}>
        <StackNav.Screen
          name="UserDetailTabView"
          component={UserDetailTabView}
          title="UserDetailTabView"
          initialParams={props.route.params}
          options={{
            headerTitle: '',
          }}
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
      </StackNav.Navigator>
    </View>
  );
}

export default UserNavigation;
