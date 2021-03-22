import React, {useEffect, memo} from 'react';
import {View, Text, ActivityIndicator, FlatList} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Icon, Divider} from 'react-native-elements';
import Posts from './tabs/Posts';
import Comments from './tabs/Comments';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchUserById,
  getUserCreatedAt,
  getUserDisplayname,
  getUserTotalKarma,
} from '../../redux/reducers/UserSlice';
import TimeAgo from '../../components/TimeAgo';

const Tab = createMaterialTopTabNavigator();

const AccountDetail = memo((props) => {
  console.log('running account detail in userdetail.js');
  const {userId} = props;

  const userTotalKarma = useSelector((state) =>
    getUserTotalKarma(state, userId),
  );
  const userCreatedAt = useSelector((state) => getUserCreatedAt(state, userId));
  const userDisplayname = useSelector((state) =>
    getUserDisplayname(state, userId),
  );

  const userKarmaField = userTotalKarma ? (
    <Text style={{fontSize: 12, color: '#555'}}>{userTotalKarma} karma</Text>
  ) : (
    <ActivityIndicator size="small" color="#4285f4" />
  );

  const userDisplaynameField = (
    <Text
      style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        paddingHorizontal: 10,
      }}>
      {userDisplayname}
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
      {userDisplaynameField}
    </View>
  );

  const userJoinedTimeAgo = userCreatedAt ? (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <Text style={{color: '#555', fontSize: 11}}>Joined </Text>
      <TimeAgo time={userCreatedAt} />
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
        {userKarmaField}
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
    <Tab.Screen
      name=" Comments "
      component={Comments}
      initialParams={{params: props.params}}
    />
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

  /* return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {AccountDetail}
      {AccountTabbedNavigation}
    </View>
  );*/

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        ListHeaderComponent={<AccountDetail userId={userId} />}
        onEndReachedThreshold={0.9}
        ListFooterComponent={<AccountTabbedNavigation params={route.params} />}
      />
    </View>
  );
}

export default UserDetail;
