import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import CommunitySettings from './CommunitySettings';
import UpdateCommunityField from './UpdateCommunityField';
import ChangeCommunityIcon from './ChangeCommunityIcon';
import CommunityMembers from './CommunityMembers';

const StackNav = createStackNavigator();

function CommunitySettingsNavigation(props) {
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
            color: '#444',
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
      </StackNav.Navigator>
    </View>
  );
}

export default CommunitySettingsNavigation;
