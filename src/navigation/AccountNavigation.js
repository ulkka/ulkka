import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Icon, Divider} from 'react-native-elements';
import About from '../screens/account/tabs/About';
import Posts from '../screens/account/tabs/Posts';
import Comments from '../screens/account/tabs/Comments';
import {useSelector} from 'react-redux';
import {selectUserById} from '../redux/reducers/UserSlice';
import TimeAgo from '../components/TimeAgo';

const Tab = createMaterialTopTabNavigator();

function AccountNavigation(props) {
  const {route} = props;

  const user = useSelector((state) =>
    selectUserById(state, route.params.userId),
  );
  console.log('user', user);

  const AccountDetail = (
    <View
      style={{
        backgroundColor: '#fff',
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
            {user.displayname}
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
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          paddingBottom: 20,
        }}>
        <Text style={{fontSize: 12, color: '#777'}}>
          {user.postKarma + user.commentKarma} karma
        </Text>
        <Divider width={20}></Divider>
        <Text style={{color: '#555', fontSize: 11}}>Joined </Text>
        <TimeAgo time={user.created_at} />
        <Text style={{color: '#555', fontSize: 11}}> ago</Text>
      </View>
    </View>
  );
  const AccountTabbedNavigation = (
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
          initialParams={{params: route.params}}
        />
        <Tab.Screen name="Comments" component={Comments} />
        <Tab.Screen name="About" component={About} />
      </Tab.Navigator>
    </View>
  );
  return (
    <View style={{flex: 1}}>
      <FlatList
        ListHeaderComponent={AccountDetail}
        ListFooterComponent={AccountTabbedNavigation}
      />
    </View>
  );
}

export default AccountNavigation;
