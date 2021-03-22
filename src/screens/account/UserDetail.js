import React, {useEffect, memo} from 'react';
import {View, Text, ActivityIndicator, FlatList} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Icon, Divider} from 'react-native-elements';
import Posts from './tabs/Posts';
import Comments from './tabs/Comments';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectUserById,
  fetchUserById,
  memoizedFlatUserByIdSelector,
} from '../../redux/reducers/UserSlice';
import TimeAgo from '../../components/TimeAgo';

const Tab = createMaterialTopTabNavigator();

const AccountDetail = memo((props) => {
  console.log('running account detail in userdetail.js');
  const {initialized, ...user} = props;
  const userKarma = initialized ? (
    <Text style={{fontSize: 12, color: '#555'}}>
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

  return (
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
});

const AccountTabbedNavigation = memo((props) => (
  <Tab.Navigator
    animationEnabled={false}
    tabBarOptions={{
      animationEnabled: false,
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
      initialParams={{params: props.params}}
    />
    <Tab.Screen name=" Comments " component={Comments} />
  </Tab.Navigator>
));

function UserDetail(props) {
  const dispatch = useDispatch();
  const {route} = props;
  const userId = route.params.userId;

  console.log('running userdetail ', userId);
  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, []);

  const getUserSelector = memoizedFlatUserByIdSelector();
  const user = useSelector((state) => getUserSelector(state, userId));
  const initialized = user.created_at ? true : false;

  useEffect(() => {
    console.log('user changed', user);
  }, [user]);
  /* return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {AccountDetail}
      {AccountTabbedNavigation}
    </View>
  );*/

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        ListHeaderComponent={
          <AccountDetail {...user} initialized={initialized} />
        }
        ListFooterComponent={<AccountTabbedNavigation params={route.params} />}
      />
    </View>
  );
}

export default UserDetail;
