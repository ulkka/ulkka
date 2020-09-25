import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HeaderBar from '../../components/Header';
import Home from './tabs/Home';
import Popular from './tabs/Popular';

const Tab = createMaterialTopTabNavigator();

function HomeNavigation({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <View>
        <HeaderBar navigation={navigation} />
      </View>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: "#444",
            inactiveTintColor: "grey",
            showIcon: true,
            labelStyle: {
              width: "100%",
              fontWeight: "bold",
            },
            tabStyle: {
              justifyContent: "flex-start",
              padding:0
            },
            style: {
              height: 30,
            },
          }}
        >
          <Tab.Screen name="Home" component={Home}  />
          <Tab.Screen name="Popular" component={Popular} />
        </Tab.Navigator>
      </View>
    </View>
  );
}

export default HomeNavigation;