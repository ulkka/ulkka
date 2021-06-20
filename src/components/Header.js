import React, {memo} from 'react';
import {TouchableOpacity, StatusBar, Platform, Image, View} from 'react-native';
import {Icon, Text, Badge} from 'react-native-elements';
import {showAuthScreen, push, navigate} from '../navigation/Ref';
import {useSelector, useDispatch} from 'react-redux';
import {showCreatorOverlay} from '../redux/reducers/CreatorOverlaySlice';
import {
  getRegistrationStatus,
  getRegisteredUser,
} from '../redux/reducers/AuthSlice';
import {getUnreadNotificationCount} from '../redux/reducers/NotificationSlice';
import UserAvatar from './UserAvatar';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const TitleComponent = memo(() => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 3,
        padding: 2,
      }}>
      <Image
        resizeMode={'contain'}
        source={require('../../assets/ulkka_title_transparent.png')}
        style={{height: 23, width: 24, marginLeft: 0, marginRight: 7}}
      />
      <Text
        style={{
          fontSize: 19,
          fontFamily: Platform.OS == 'ios' ? 'Verdana' : 'sans-serif-condensed',
          fontWeight: Platform.OS == 'ios' ? '500' : 'bold',
          color: '#424242',
        }}>
        Ulkka
      </Text>
    </View>
  );
});

const Notifications = memo(() => {
  const unReadNotificationCount = useSelector(getUnreadNotificationCount);
  return (
    <TouchableOpacity
      onPress={() => navigate('Notifications')}
      style={{paddingRight: 5}}>
      <Icon
        name={unReadNotificationCount ? 'bell' : 'bell-o'}
        color={unReadNotificationCount ? '#222' : '#555'}
        type="font-awesome"
        size={Platform.OS == 'ios' ? 22 : 18}
      />
      {unReadNotificationCount ? (
        <Badge
          status="error"
          value={unReadNotificationCount}
          textStyle={{fontSize: 10}}
          containerStyle={{
            position: 'absolute',
            top: -6,
            right: -5,
            width: 30,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
});

const Creator = memo(({isRegistered}) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      onPress={() =>
        isRegistered ? dispatch(showCreatorOverlay()) : showAuthScreen()
      }>
      <Icon
        name={'plus'}
        color={'#555'}
        type="material-community"
        size={Platform.OS == 'ios' ? 25 : 23}
      />
    </TouchableOpacity>
  );
});

const HeaderBar = (props) => {
  const isRegistered = useSelector(getRegistrationStatus);
  const registeredUser = useSelector(getRegisteredUser);

  const AccountComponent = () => {
    const avatar = isRegistered ? (
      <UserAvatar seed={registeredUser.displayname} size="header" />
    ) : (
      <Icon
        name="account"
        type="material-community"
        color={'#555'}
        size={Platform.OS == 'ios' ? 21 : 22}
      />
    );

    return (
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 10, left: 20, right: 40}}
        onPress={() => {
          isRegistered
            ? push('UserDetail', {
                userId: registeredUser?._id,
              })
            : showAuthScreen();
        }}>
        {avatar}
      </TouchableOpacity>
    );
  };

  const SearchIcon = () => {
    return (
      <TouchableOpacity onPress={() => navigate('Search')}>
        <Icon
          name="search"
          color="#555"
          size={Platform.OS == 'ios' ? 24 : 21}
        />
      </TouchableOpacity>
    );
  };

  const registeredUserHeaderRight = (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
      <SearchIcon />
      <View style={{width: 13}}></View>
      <Creator isRegistered={isRegistered} />
      <View style={{width: 15}}></View>
      <Notifications />
      <View style={{width: 12}}></View>
      <AccountComponent />
    </View>
  );

  const unregisteredUserHeaderRight = (
    <View
      style={{
        flex: 1,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <SearchIcon />
      <View style={{width: 13}}></View>
      <Creator isRegistered={isRegistered} />
      <View style={{width: 12}}></View>
      <AccountComponent />
    </View>
  );

  const headerRight = isRegistered
    ? registeredUserHeaderRight
    : unregisteredUserHeaderRight;

  const headerLeft = (
    <View style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
      <TitleComponent />
    </View>
  );

  const headerContents = (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 8,
        marginTop: Platform.OS == 'ios' ? 5 : 8,
        marginBottom: Platform.OS == 'ios' ? 8 : 5,
      }}>
      {headerLeft}
      <View style={{flex: 1}}></View>
      {headerRight}
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: '#fff',
        paddingBottom: 2,
        // will be 0 on Android, because You pass true to skipAndroid
        paddingTop: getStatusBarHeight(true),
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      {headerContents}
    </View>
  );
};

export default memo(HeaderBar);
