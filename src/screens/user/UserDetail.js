import React, {useEffect, useState, memo, useRef} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Icon, Divider, Tooltip} from 'react-native-elements';
import Posts from './tabs/Posts';
import Comments from './tabs/Comments';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchUserById,
  getUserCreatedAt,
  getUserDisplayname,
  getUserTotalKarma,
  blockUser,
} from '../../redux/reducers/UserSlice';
import {
  getRegisteredUser,
  getBlockedUsers,
} from '../../redux/reducers/AuthSlice';
import TimeAgo from '../../components/TimeAgo';
import UserAvatar from '../../components/UserAvatar';
import {Button} from 'react-native-elements';
import {goBack} from '../../navigation/Ref';
import {showOptionSheet} from '../../redux/reducers/OptionSheetSlice';
import {numberWithCommas} from '../../components/helpers';
import TextInputFieldWithActions from '../../components/UserBioField';
import UserDisplaynameField from '../../components/UserDisplaynameField';

const Tab = createMaterialTopTabNavigator();

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const AccountDetail = memo((props) => {
  const dispatch = useDispatch();
  console.log('running account detail in userdetail.js');

  const iconSize = useRef(new Animated.Value(8)).current; // Initial value for opacity: 0

  const {userId} = props;

  // Karma Animation
  const easing = Easing.ease;
  const duration = Platform.OS == 'ios' ? 210 : 250;
  const useNativeDriver = false;
  const beat = (iconSize) =>
    Animated.timing(iconSize, {
      toValue: 13,
      duration: duration,
      useNativeDriver: useNativeDriver,
      easing: easing,
    });

  const beatBack = (iconSize) =>
    Animated.timing(iconSize, {
      toValue: 9,
      duration: duration,
      useNativeDriver: useNativeDriver,
      easing: easing,
    });

  const heartBeat = () => {
    Animated.sequence([beat(iconSize), beatBack(iconSize)]).start(() =>
      heartBeat(),
    );
  };

  useEffect(() => {
    heartBeat();
  }, []);
  // Animation over

  const registeredUser = useSelector(getRegisteredUser);
  const registeredUserId = registeredUser?._id;
  const isProfile = userId == registeredUserId;

  const userTotalKarma = useSelector((state) =>
    getUserTotalKarma(state, userId),
  );
  const userCreatedAt = useSelector((state) => getUserCreatedAt(state, userId));
  const userDisplayname = useSelector((state) =>
    getUserDisplayname(state, userId),
  );

  const userKarmaField =
    userTotalKarma || userTotalKarma === 0 ? (
      <Tooltip
        popover={
          <Text style={{color: '#eee', lineHeight: 20}}>
            Get upvotes on your posts and comments to win more hearts!
          </Text>
        }
        backgroundColor="#555"
        height={80}
        width={200}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: '#555',
              fontWeight: 'bold',
              letterSpacing: 0.5,
              paddingRight: 0,
            }}>
            {numberWithCommas(userTotalKarma)}{' '}
          </Text>
          <View style={{width: 20}}>
            <AnimatedIcon
              name="heart"
              type="font-awesome"
              size={iconSize}
              color="#ff4301"
            />
          </View>
        </View>
      </Tooltip>
    ) : (
      <ActivityIndicator size="small" color="#4285f4" />
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
      <UserDisplaynameField userId={userId} />
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

  const blockUserAlert = () => {
    Alert.alert(
      'Block ' + userDisplayname + ' ?',
      "You won't be able to see posts and comments from this user and they won't be able to see your posts and comments on Ulkka. We won't let them know that you've blocked them",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => dispatch(blockUser(userId)),
        },
      ],
      {cancelable: true},
    );
  };

  const accountSettings = (
    <TouchableOpacity
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      style={{paddingRight: 10, flexDirection: 'row', alignItems: 'center'}}
      onPress={() => dispatch(showOptionSheet({type: 'user', id: userId}))}>
      <Icon name="gear" type="font-awesome" size={24} color={'#666'} />
    </TouchableOpacity>
  );

  const blockUserView = (
    <TouchableOpacity
      hitSlop={{top: 20, bottom: 30, left: 20, right: 20}}
      style={{paddingRight: 5, flexDirection: 'row', alignItems: 'center'}}
      onPress={() => blockUserAlert()}>
      <Icon
        raised
        name="user-slash"
        type="font-awesome-5"
        size={14}
        color={'#ff2222'}
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
        {isProfile ? accountSettings : blockUserView}
      </View>
      <TextInputFieldWithActions userId={userId} />
      <View
        style={{
          paddingHorizontal: 5,
          flexDirection: 'row',
          alignItems: 'center',
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
  const dispatch = useDispatch();
  const {route} = props;
  const userId = route.params.userId;
  const blockedUsers = useSelector(getBlockedUsers);
  const isUserBlocked = blockedUsers?.includes(userId);
  useEffect(() => {
    if (!isUserBlocked) {
      dispatch(fetchUserById(userId));
    }
  }, []);

  console.log('running userdetail ', userId);

  return isUserBlocked ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#fafafa',
      }}>
      <Text style={{fontWeight: 'bold', fontSize: 20, color: '#555'}}>
        {'  '}
        User not available{'  '}
      </Text>
      <Button
        title="Go Back"
        type="outline"
        raised
        titleStyle={{fontSize: 15, color: '#2a9df4', padding: 4}}
        onPress={() => goBack()}
      />
    </View>
  ) : (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        keyboardShouldPersistTaps="always"
        ListHeaderComponent={<AccountDetail userId={userId} />}
        onEndReachedThreshold={0.9}
        ListFooterComponent={<AccountTabbedNavigation userId={userId} />}
      />
    </View>
  );
}

export default UserDetail;
