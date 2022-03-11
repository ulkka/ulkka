import React from 'react';
import {View, Platform} from 'react-native';
import {useTheme} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import ChatList from '../screens/messages/ChatList';
import ChatDetailNavigation from '../screens/messages/ChatDetailNavigation';

const StackNav = createStackNavigator();

function MessagesNavigation(props) {
  const {theme} = useTheme();
  const headerStyle =
    Platform.OS == 'ios'
      ? {
          height: 40,
        }
      : {height: 40};

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}>
      <StackNav.Navigator
        initialRouteName="ChatList"
        screenOptions={{
          headerBackTitle: '',
          headerStatusBarHeight: 0,
          headerStyle: headerStyle,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: Platform.OS === 'ios' ? 17 : 15,
            color: theme.colors.black4,
          },
        }}>
        <StackNav.Screen
          name="ChatDetailNavigation"
          component={ChatDetailNavigation}
          options={{headerShown: false}}
          initialParams={props.route.params}
        />
        <StackNav.Screen
          name="ChatList"
          component={ChatList}
          title="Chat List"
          options={{
            headerTitle: 'Chat List',
          }}
        />
      </StackNav.Navigator>
    </View>
  );
}

export default MessagesNavigation;
