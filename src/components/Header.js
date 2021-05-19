import React, {useState, memo} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  View,
} from 'react-native';
import {Icon, Text, Badge} from 'react-native-elements';
import Search from './Search';
import {showAuthScreen, push} from '../navigation/Ref';
import {useSelector, useDispatch} from 'react-redux';
import {showCreatorOverlay} from '../redux/reducers/CreatorOverlaySlice';
import {
  getRegistrationStatus,
  getRegisteredUser,
} from '../redux/reducers/AuthSlice';
import {
  getSearchMode,
  setSearchMode,
  resetSearch,
} from '../redux/reducers/SearchSlice';
import {getUnreadNotificationCount} from '../redux/reducers/NotificationSlice';
import UserAvatar from './UserAvatar';
import {navigate} from '../navigation/Ref';

const TitleComponent = memo(() => {
  return (
    <SafeAreaView
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
    </SafeAreaView>
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
        size={Platform.OS == 'ios' ? 24 : 23}
      />
    </TouchableOpacity>
  );
});

const HeaderBar = (props) => {
  const dispatch = useDispatch();
  const searchMode = useSelector(getSearchMode);
  const isRegistered = useSelector(getRegistrationStatus);
  const registeredUser = useSelector(getRegisteredUser);

  const _toggleSearch = () => {
    const currentSearchMode = searchMode;
    dispatch(setSearchMode(!currentSearchMode));
    if (!currentSearchMode) navigate('Search');
    else {
      dispatch(resetSearch());
      navigate('HomeFeed');
    }
  };

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
        hitSlop={{top: 20, bottom: 30, left: 20, right: 40}}
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
    return !searchMode ? (
      <Icon
        name="search"
        color="#555"
        onPress={() => _toggleSearch()}
        size={Platform.OS == 'ios' ? 24 : 21}
      />
    ) : (
      <TouchableOpacity onPress={() => _toggleSearch()}>
        <Text
          style={{
            fontSize: 13,
            color: '#444',
            fontWeight: 'bold',
            paddingTop: 4,
          }}>
          Cancel
        </Text>
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
    <SafeAreaView
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 8,
        marginVertical: Platform.OS == 'ios' ? 5 : 5,
      }}>
      {headerLeft}
      <View style={{flex: 1}}></View>
      {headerRight}
    </SafeAreaView>
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        paddingBottom: 2,
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      {searchMode ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'space-evenly',
          }}>
          <Search />
          <View style={{width: 15}}></View>
          <SearchIcon />
        </View>
      ) : (
        headerContents
      )}
    </SafeAreaView>
  );
};

export default memo(HeaderBar);
