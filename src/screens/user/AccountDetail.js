import React, {useEffect, memo, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import {Icon, Tooltip, useTheme} from 'react-native-elements';
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
import {useTranslation} from 'react-i18next';
import {navigate} from '../../navigation/Ref';
//const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const AccountDetail = memo(props => {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {userId, titleShown, navigation} = props;
  const blockedUsers = useSelector(getBlockedUsers);
  const isUserBlocked = blockedUsers?.includes(userId);
  const isCurrentUserAdminOfAnyCommunity = useSelector(
    getIsCurrentUserAdminOfAnyCommunity,
  );

  const registeredUser = useSelector(getRegisteredUser);
  const registeredUserId = registeredUser?._id;
  const isProfile = userId == registeredUserId;

  const userTotalKarma = useSelector(state => getUserTotalKarma(state, userId));
  const userCreatedAt = useSelector(state => getUserCreatedAt(state, userId));
  const userDisplayname = useSelector(state =>
    getUserDisplayname(state, userId),
  );

  useEffect(() => {
    if (!isUserBlocked) {
      dispatch(fetchUserById(userId));
    }
  }, []);

  useEffect(() => {
    if (!isProfile) {
      if (userDisplayname) {
        navigation.setOptions({
          headerRight: () => blockUserView(),
        });
      }
    } else {
      navigation.setOptions({
        headerRight: () => AccountSettings(),
      });
    }
  }, [userDisplayname]);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userDisplayname) {
      navigation.setOptions({
        headerTitle: () => (
          <Animated.View style={[{opacity: opacity}]}>
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.black4,
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
  const beat = iconSize =>
    Animated.timing(iconSize, {
      toValue: 14,
      duration: duration,
      useNativeDriver: useNativeDriver,
      easing: easing,
    });

  const beatBack = iconSize =>
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
  const blockUserAlert = () => {
    Alert.alert(
      userDisplayname ? 'Block ' + userDisplayname + ' ?' : 'Block User ?',
      "You won't be able to see posts and comments from this user and they won't be able to see your posts and comments on Omong. We won't let them know that you've blocked them",
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

  const blockUserView = () => {
    return (
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <TouchableOpacity
          hitSlop={{top: 20, bottom: 30, left: 20, right: 20}}
          style={{paddingRight: 5, flexDirection: 'row', alignItems: 'center'}}
          onPress={() => blockUserAlert()}>
          <Icon
            raised
            name="user-slash"
            type="font-awesome-5"
            size={14}
            color={'red'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{top: 20, bottom: 30, left: 20, right: 20}}
          style={{paddingRight: 5, flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            navigate('ChatDetailNavigation', {username: userDisplayname});
          }}>
          <Icon
            raised
            name="envelope"
            type="font-awesome-5"
            size={14}
            color={'#FF7BAC'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const userKarmaField =
    userTotalKarma || userTotalKarma === 0 ? (
      <Tooltip
        popover={
          <Text style={{color: theme.colors.grey2, lineHeight: 20}}>
            Get upvotes on your posts and comments to win more hearts!
          </Text>
        }
        backgroundColor={theme.colors.black5}
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
              color: theme.colors.black5,
              fontWeight: 'bold',
              letterSpacing: 0.5,
              paddingRight: 0,
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {numberWithCommas(userTotalKarma)}
          </Text>
          <View style={{width: 20}}>
            <Icon name="heart" type="font-awesome" size={14} color="#ff4301" />
          </View>
        </View>
      </Tooltip>
    ) : (
      <Image
        source={require('../../../assets/loading.gif')}
        style={{height: 20, width: 20}}
      />
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
      <Text style={{color: theme.colors.black5, fontSize: 11}}>
        {t('Joined')}{' '}
      </Text>
      <TimeAgo time={userCreatedAt} />
      <Text style={{color: theme.colors.black5, fontSize: 11}}>
        {' '}
        {t('ago')}
      </Text>
    </View>
  ) : (
    <Image
      source={require('../../../assets/loading.gif')}
      style={{height: 20, width: 20}}
    />
  );

  const AccountSettings = () => (
    <TouchableOpacity
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      style={{marginRight: 15, flexDirection: 'row', alignItems: 'center'}}
      onPress={() => dispatch(showOptionSheet({type: 'user', id: userId}))}>
      <Icon
        name="gear"
        type="font-awesome"
        size={24}
        color={theme.colors.black6}
      />
    </TouchableOpacity>
  );

  return isUserBlocked ? (
    <View
      style={{
        height: 180,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: theme.colors.black5,
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
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.grey2,
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
        <View style={{width: 28}} />
        {userJoinedTimeAgo}
      </View>
    </View>
  );
});

export default AccountDetail;
