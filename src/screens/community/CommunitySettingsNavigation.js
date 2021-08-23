import React, {useContext} from 'react';
import {View, Platform} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import CommunitySettings from './CommunitySettings';
import UpdateCommunityField from './UpdateCommunityField';
import ChangeCommunityIcon from './ChangeCommunityIcon';
import CommunityMembers from './CommunityMembers';
import CommunityAdminSettings from './CommunityAdminSettings';
import BannedMembers from './BannedMembers';

const StackNav = createStackNavigator();

function CommunitySettingsNavigation(props) {
  const {theme} = useContext(ThemeContext);

  return (
    <View style={{flex: 1}}>
      <StackNav.Navigator
        initialRouteName="CommunitySettings"
        screenOptions={{
          headerStyle:
            Platform.OS == 'android'
              ? {
                  height: 40,
                }
              : {},
          headerTitleStyle: {
            fontSize: Platform.OS == 'ios' ? 17 : 15,
            color: theme.colors.black4,
          },
        }}>
        <StackNav.Screen
          name="CommunitySettings"
          component={CommunitySettings}
          title="CommunitySettings"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Community Settings',
            headerTitleAlign: 'center',
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
          name="UpdateCommunityRules"
          component={UpdateCommunityField}
          title="UpdateCommunityRules"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Community Rules',
            headerTitleAlign: 'center',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
          }}
          initialParams={{...props.route.params, field: 'rules'}}
        />
        <StackNav.Screen
          name="UpdateCommunityDescription"
          component={UpdateCommunityField}
          title="UpdateCommunityDescription"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Community Description',
            headerTitleAlign: 'center',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
          }}
          initialParams={{...props.route.params, field: 'description'}}
        />
        <StackNav.Screen
          name="ChangeCommunityIcon"
          component={ChangeCommunityIcon}
          title="ChangeCommunityIcon"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Community Icon',
            headerTitleAlign: 'center',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
          }}
          initialParams={{...props.route.params, field: 'icon'}}
        />
        <StackNav.Screen
          name="CommunityMembers"
          component={CommunityMembers}
          title="CommunityMembers"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Community Members',
            headerTitleAlign: 'center',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
          }}
          initialParams={{...props.route.params}}
        />
        <StackNav.Screen
          name="CommunityAdminSettings"
          component={CommunityAdminSettings}
          title="CommunityAdminSettings"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Community Admins',
            headerTitleAlign: 'center',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
          }}
          initialParams={{...props.route.params}}
        />
        <StackNav.Screen
          name="BannedMembers"
          component={BannedMembers}
          title="Banned Users"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Banned Users',
            headerTitleAlign: 'center',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
          }}
          initialParams={{...props.route.params}}
        />
      </StackNav.Navigator>
    </View>
  );
}

export default CommunitySettingsNavigation;
