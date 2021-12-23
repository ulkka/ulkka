import React from 'react';
import {View, Platform} from 'react-native';
import {useTheme} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import CommunityDetailTabView from './CommunityDetailTabView';
import CommunitySettingsNavigation from './CommunitySettingsNavigation';
import {useSelector} from 'react-redux';
import {getUserRoleInCommunity} from '../../redux/reducers/CommunitySlice';
import GrowCommunity from './GrowCommunity';

const StackNav = createStackNavigator();

function CommunityNavigation(props) {
  const {theme} = useTheme();

  const {communityId} = props.route.params;
  const userRole = useSelector(state =>
    getUserRoleInCommunity(state, communityId),
  );

  return (
    <View style={{flex: 1}}>
      <StackNav.Navigator
        initialRouteName="CommunityDetail"
        screenOptions={{
          headerBackTitle: 'Back',
          headerBackTitleVisible: false,
          //  headerBackTitleStyle: {color: '#eee'},
          ...(Platform.OS == 'android' && {
            headerTitleStyle: {
              fontSize: 15,
              color: theme.colors.black5,
            },
            headerTitleAlign: 'center',
            headerStyle: {height: 40},
          }),
        }}>
        <StackNav.Screen
          name="CommunityDetail"
          component={CommunityDetailTabView}
          title="CommunityDetail"
          initialParams={props.route.params}
        />
        <StackNav.Screen
          name="GrowCommunity"
          component={GrowCommunity}
          title="GrowComunity"
          options={{
            headerTitle: 'Grow Your Community',
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
