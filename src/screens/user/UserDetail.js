import React, {useEffect, memo} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
import {getRegisteredUser} from '../../redux/reducers/AuthSlice';
import {signout} from '../../redux/actions/AuthActions';
import TimeAgo from '../../components/TimeAgo';
import UserAvatar from '../../components/UserAvatar';

const Tab = createMaterialTopTabNavigator();

const AccountDetail = memo((props) => {
  console.log('running account detail in userdetail.js');
  const dispatch = useDispatch();
  const {userId} = props;

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, []);

  const registeredUser = useSelector(getRegisteredUser);

  const isProfile = userId == registeredUser?._id;

  const userTotalKarma = useSelector((state) =>
    getUserTotalKarma(state, userId),
  );
  const userCreatedAt = useSelector((state) => getUserCreatedAt(state, userId));
  const userDisplayname = useSelector((state) =>
    getUserDisplayname(state, userId),
  );

  const userKarmaField =
    userTotalKarma || userTotalKarma === 0 ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            color: '#555',
            fontWeight: 'bold',
            letterSpacing: 0.5,
          }}>
          {userTotalKarma}{' '}
        </Text>
        <Icon name="trophy" type="font-awesome-5" size={11} color="#ff4301" />
      </View>
    ) : (
      <ActivityIndicator size="small" color="#4285f4" />
    );

  const userDisplaynameField = (
    <Text
      style={{
        fontSize: 17,
        fontWeight: 'bold',
        color: '#555',
        paddingHorizontal: 10,
      }}>
      {userDisplayname}
      {'  '}
    </Text>
  );

  const avatar = (
    //< Icon name = "account-circle" size = { 40} />
    <UserAvatar seed={userDisplayname} size={'extralarge'} />
  );

  const userAvatarAndDisplayName = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {avatar}
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

  const signoutConfirmationAlert = () =>
    Alert.alert('Log out ?', null, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => signOut()},
    ]);

  const signOut = async () => {
    try {
      dispatch(signout());
    } catch (error) {
      console.error(error);
    }
  };

  const logoutButton = (
    <TouchableOpacity
      style={{paddingRight: 5, flexDirection: 'row', alignItems: 'center'}}
      onPress={() => signoutConfirmationAlert()}>
      <Text style={{color: '#2a9df4'}}>Logout</Text>
      <Icon
        name="sign-out"
        type="font-awesome"
        size={15}
        color={'#2a9df4'}
        style={{paddingLeft: 8}}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {userAvatarAndDisplayName}
        {isProfile && logoutButton}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 20,
          paddingHorizontal: 5,
        }}>
        {userKarmaField}
        <Divider width={28} height={0}></Divider>
        {userJoinedTimeAgo}
      </View>
    </View>
  );
});

const AccountTabbedNavigation = memo((props) => {
  const {userId} = props;
  return (
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
        initialParams={{userId: userId}}
      />
      <Tab.Screen
        name=" Comments "
        component={Comments}
        initialParams={{userId: userId}}
      />
    </Tab.Navigator>
  );
});

function UserDetail(props) {
  const {route} = props;
  const userId = route.params.userId;

  console.log('running userdetail ', userId);

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
        ListFooterComponent={<AccountTabbedNavigation userId={userId} />}
      />
    </View>
  );
}

export default UserDetail;
