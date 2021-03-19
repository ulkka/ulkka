import React, {useEffect} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Icon, Divider} from 'react-native-elements';
import Posts from './tabs/Posts';
import Comments from './tabs/Comments';
import {useSelector, useDispatch} from 'react-redux';
import {selectUserById, fetchUserById} from '../../redux/reducers/UserSlice';
import TimeAgo from '../../components/TimeAgo';

const Tab = createMaterialTopTabNavigator();

function UserDetail(props) {
  const dispatch = useDispatch();
  const {route} = props;
  const userId = route.params.userId;

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, []);

  const user = useSelector((state) => selectUserById(state, userId));
  const initialized = user.created_at ? true : false;

  const userKarma = initialized ? (
    <Text style={{fontSize: 12, color: '#777'}}>
      {user.postKarma + user.commentKarma} karma
    </Text>
  ) : (
    <ActivityIndicator size="small" color="#4285f4" />
  );

  const userDisplayname = (
    <Text
      style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        paddingHorizontal: 10,
      }}>
      {user.displayname}
      {'  '}
    </Text>
  );

  const userAvatar = <Icon name="account-circle" size={40} />;

  const userAvatarAndDisplayName = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {userAvatar}
      {userDisplayname}
    </View>
  );

  const userJoinedTimeAgo = initialized ? (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <Text style={{color: '#555', fontSize: 11}}>Joined </Text>
      <TimeAgo time={user.created_at} />
      <Text style={{color: '#555', fontSize: 11}}> ago</Text>
    </View>
  ) : (
    <ActivityIndicator size="small" color="#4285f4" />
  );

  const AccountDetail = (
    <View
      style={{
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
      }}>
      {userAvatarAndDisplayName}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 20,
          paddingHorizontal: 5,
        }}>
        {userKarma}
        <Divider width={20} height={0}></Divider>
        {userJoinedTimeAgo}
      </View>
    </View>
  );

  const AccountTabbedNavigation = (
    <View style={{flex: 1}}>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#444',
          inactiveTintColor: 'grey',
          labelStyle: {
            fontWeight: 'bold',
            fontSize: 13,
          },
        }}>
        <Tab.Screen
          name=" Posts "
          component={Posts}
          initialParams={{params: route.params}}
        />
        <Tab.Screen name=" Comments " component={Comments} />
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

export default UserDetail;
