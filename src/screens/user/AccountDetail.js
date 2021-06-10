import React, {useEffect, memo, useRef} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import {Icon, Divider, Tooltip, Button} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getUserCreatedAt,
  getUserDisplayname,
  getUserTotalKarma,
  blockUser,
  fetchUserById,
} from '../../redux/reducers/UserSlice';
import {
  getRegisteredUser,
  getBlockedUsers,
} from '../../redux/reducers/AuthSlice';
import TimeAgo from '../../components/TimeAgo';
import UserAvatar from '../../components/UserAvatar';
import {showOptionSheet} from '../../redux/reducers/OptionSheetSlice';
import {numberWithCommas} from '../../components/helpers';
import UserBioField from '../../components/UserBioField';
import UserDisplaynameField from '../../components/UserDisplaynameField';
import InviteUserToCommunity from './InviteUserToCommunity';
import {getIsCurrentUserAdminOfAnyCommunity} from '../../redux/reducers/CommunitySlice';
import {navigate} from '../../navigation/Ref';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const AccountDetail = memo((props) => {
  const dispatch = useDispatch();

  const {userId, titleShown, navigation} = props;
  const blockedUsers = useSelector(getBlockedUsers);
  const isUserBlocked = blockedUsers?.includes(userId);
  const isCurrentUserAdminOfAnyCommunity = useSelector(
    getIsCurrentUserAdminOfAnyCommunity,
  );

  const registeredUser = useSelector(getRegisteredUser);
  const registeredUserId = registeredUser?._id;
  const isProfile = userId == registeredUserId;

  useEffect(() => {
    if (!isProfile) {
      navigation.setOptions({
        headerRight: () => blockUserView(),
      });
    } else {
      navigation.setOptions({
        headerRight: () => AccountSettings(),
      });
    }
    if (!isUserBlocked) {
      dispatch(fetchUserById(userId));
    }
  }, []);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userDisplayname) {
      navigation.setOptions({
        headerTitle: () => (
          <Animated.View style={[{opacity: opacity}]}>
            <Text
              style={{
                fontSize: 16,
                color: '#444',
                fontWeight: 'bold',
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              {userDisplayname}
            </Text>
          </Animated.View>
        ),
        headerTitleAlign: 'center',
      });
    }
  }, [userDisplayname]);

  useEffect(() => {
    if (titleShown) {
      Animated.timing(opacity, {
        duration: 250, // some number in milliseconds
        toValue: 1, // or whatever final opacity you'd like
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        duration: 250, // some number in milliseconds
        toValue: 0, // or whatever final opacity you'd like
        useNativeDriver: true,
      }).start();
    }
  }, [titleShown]);

  // Karma Animation
  const iconSize = useRef(new Animated.Value(8)).current; // Initial value for opacity: 0
  const easing = Easing.ease;
  const duration = Platform.OS == 'ios' ? 210 : 250;
  const useNativeDriver = false;
  const beat = (iconSize) =>
    Animated.timing(iconSize, {
      toValue: 14,
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
              fontSize: 15,
              color: '#555',
              fontWeight: 'bold',
              letterSpacing: 0.5,
              paddingRight: 0,
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {numberWithCommas(userTotalKarma)}
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

  const UserCommunitiesView = () => {
    return (
      <Button
        raised
        title="My Communities"
        containerStyle={{
          borderWidth: 1,
          borderColor: '#02862ad6',
          marginHorizontal: 10,
        }}
        buttonStyle={{
          borderRadius: 15,
          paddingHorizontal: 15,
          paddingVertical: 5,
        }}
        icon={
          <Icon
            name="group"
            type="font-awesome"
            size={13}
            color="#02862ad6"
            style={{marginRight: 10}}
          />
        }
        titleStyle={{color: '#02862ad6', fontSize: 11}}
        onPress={() => navigate('UserCommunities')}
      />
    );
  };

  const AccountSettings = () => (
    <TouchableOpacity
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      style={{marginRight: 15, flexDirection: 'row', alignItems: 'center'}}
      onPress={() => dispatch(showOptionSheet({type: 'user', id: userId}))}>
      <Icon name="gear" type="font-awesome" size={24} color={'#666'} />
    </TouchableOpacity>
  );

  const blockUserView = () => {
    return (
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
  };

  return isUserBlocked ? (
    <View
      style={{
        height: 180,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: '#555',
          fontSize: 20,
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        User Not Available
      </Text>
    </View>
  ) : (
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
        {isProfile && <UserCommunitiesView />}
        {!isProfile && isCurrentUserAdminOfAnyCommunity && (
          <InviteUserToCommunity userId={userId} />
        )}
      </View>
      <UserBioField userId={userId} />
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

export default AccountDetail;
