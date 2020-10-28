import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Icon} from 'react-native-elements';
import About from './tabs/About';
import Posts from './tabs/Posts';

const Tab = createMaterialTopTabNavigator();

function CommunityNavigation({route, navigation}) {
  const CommunityDetail = (
    <View
      style={{
        backgroundColor: 'lightblue',
        borderColor: '#ddd',
        borderBottomWidth: 1,
        borderTopWidth: 1,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Icon name="account-circle" size={40} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#444',
              paddingHorizontal: 10,
            }}>
            Community Title
          </Text>
        </View>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 15,
            borderColor: 'green',
            paddingVertical: 2,
          }}>
          <Text>Join</Text>
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Text style={{fontSize: 12, color: '#777'}}>723,492 members</Text>
      </View>
      <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
        <Text>
          Toddlers who are just too young to understand whats going on
        </Text>
      </View>
    </View>
  );
  const CommunityTabbedNavigation = (
    <View style={{flex: 1}}>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#444',
          inactiveTintColor: 'grey',
          showIcon: true,
          labelStyle: {
            width: '100%',
            fontWeight: 'bold',
            fontSize: 13,
          },
          tabStyle: {
            //  justifyContent: 'flex-start',
            padding: 0,
          },
          style: {
            height: 50,
          },
        }}>
        <Tab.Screen
          name="Posts"
          component={Posts}
          initialParams={{community_id: route.params.community_id}}
        />
        <Tab.Screen name="About" component={About} />
      </Tab.Navigator>
    </View>
  );
  return (
    <View style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={CommunityDetail}
        ListFooterComponent={CommunityTabbedNavigation}
      />
    </View>
  );
}

export default CommunityNavigation;
