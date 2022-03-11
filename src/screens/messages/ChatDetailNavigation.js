import React from 'react';
import {View, Platform} from 'react-native';
import {useTheme} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import ChatDetail from './ChatDetail';

const StackNav = createStackNavigator();

function ChatDetailNavigation(props) {
  console.log(props);
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
        initialRouteName="ChatDetail"
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
          name="ChatDetail"
          component={ChatDetail}
          title="Chat Detail"
          initialParams={props.route.params}
          options={{
            headerShown: true,
            headerTitle: props.route.params.username || '',
            headerBackTitle: '',
            headerBackTitleStyle: {
              fontSize: 16,
            },
          }}
        />
      </StackNav.Navigator>
    </View>
  );
}

export default ChatDetailNavigation;
