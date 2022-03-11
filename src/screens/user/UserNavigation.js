import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import UserDetailTabView from './UserDetailTabView';
import BlockedUsers from './BlockedUsers';
import {useTranslation} from 'react-i18next';
import ChatDetailNavigation from '../messages/ChatDetailNavigation';

const StackNav = createStackNavigator();

function UserNavigation(props) {
  const {theme} = useTheme();
  const {t} = useTranslation();

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
          name="ChatDetailNavigation"
          component={ChatDetailNavigation}
          options={{headerShown: false}}
          initialParams={props.route.params}
        />
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
            headerTitle: t('Blocked Users'),
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
