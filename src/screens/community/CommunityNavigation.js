import React from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import CommunityDetailTabView from './CommunityDetailTabView';
import CommunitySettingsNavigation from './CommunitySettingsNavigation';
import {useSelector} from 'react-redux';
import {getUserRoleInCommunity} from '../../redux/reducers/CommunitySlice';
import GrowCommunity from './GrowCommunity';

const StackNav = createStackNavigator();

function CommunityNavigation(props) {
  const {communityId} = props.route.params;
  const userRole = useSelector((state) =>
    getUserRoleInCommunity(state, communityId),
  );

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
          name="CommunityDetail"
          component={CommunityDetailTabView}
          title="CommunityDetail"
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
          name="GrowCommunity"
          component={GrowCommunity}
          title="GrowComunity"
          options={{
            headerBackTitle: 'Back',
            headerTitle: 'Grow Your Community',
            headerStyle:
              Platform.OS == 'android'
                ? {
                    height: 40,
                  }
                : {},
            headerTitleAlign: 'center',
          }}
          initialParams={props.route.params}
        />
        {userRole == 'admin' && (
          <StackNav.Screen
            name="CommunitySettings"
            component={CommunitySettingsNavigation}
            title="CommunitySettings"
            options={{
              headerShown: false,
            }}
            initialParams={props.route.params}
          />
        )}
      </StackNav.Navigator>
    </View>
  );
}

export default CommunityNavigation;
