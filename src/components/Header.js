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
import {getUnreadNotificationCount} from '../redux/reducers/NotificationSlice';
import UserAvatar from './UserAvatar';
import {navigate} from '../navigation/Ref';

const TitleComponent = memo(() => {
  // return searchMode == false ? (
  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <Text
        style={{
          fontSize: 19,
          fontFamily: Platform.OS == 'ios' ? 'Verdana' : 'sans-serif-condensed',
          fontWeight: Platform.OS == 'ios' ? '500' : 'bold',
          color: '#444',
        }}>
        Ulkka
      </Text>
      <Image
        resizeMode={'contain'}
        source={require('../../assets/ulkka_title_transparent.png')}
        style={{height: 23, width: 24, marginLeft: 7}}
      />
    </SafeAreaView>
  );
  /* ) : (
    <Search />
  );*/
});

const Notifications = memo(() => {
  const unReadNotificationCount = useSelector(getUnreadNotificationCount);
  return (
    <TouchableOpacity
      onPress={() => navigate('Notifications')}
      style={{paddingRight: 5}}>
      <Icon
        name={unReadNotificationCount ? 'bell' : 'bell-o'}
        color={unReadNotificationCount ? '#222' : '#666'}
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

const HeaderBar = (props) => {
  const [searchMode, setSearchMode] = useState(false);
  const isRegistered = useSelector(getRegistrationStatus);
  const registeredUser = useSelector(getRegisteredUser);

  const _toggleSearch = () => setSearchMode(!searchMode);

  const Creator = memo(() => {
    const dispatch = useDispatch();
    return (
      <TouchableOpacity
        onPress={() =>
          isRegistered ? dispatch(showCreatorOverlay()) : showAuthScreen()
        }>
        <Icon
          name={'plus'}
          color={'#666'}
          type="font-awesome"
          size={Platform.OS == 'ios' ? 22 : isRegistered ? 19 : 20}
        />
      </TouchableOpacity>
    );
  });

  const AccountComponent = () => {
    const avatar = isRegistered ? (
      <UserAvatar seed={registeredUser.displayname} size="large" />
    ) : (
      <Icon
        name="user-alt"
        type="font-awesome-5"
        color={'#555'}
        size={Platform.OS == 'ios' ? 21 : 20}
        style={{
          paddingVertical: Platform.OS == 'ios' ? 7 : 6,
          paddingHorizontal: 5,
        }}
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

  const SearchComponent = () => {
    return !searchMode ? (
      <Icon
        name="search"
        color="#fff"
        disabled
        disabledStyle={{backgroundColor: '#fff'}}
        onPress={() => _toggleSearch()}
        size={Platform.OS == 'ios' ? 25 : 22}
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        paddingBottom: 2,
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          marginHorizontal: 8,
          marginVertical: Platform.OS == 'ios' ? 5 : 3,
        }}>
        <View
          style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
          <AccountComponent />
        </View>
        <View style={{flex: 1}}>
          <TitleComponent />
        </View>
        {isRegistered ? (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Creator />
            <View style={{width: 20}}></View>
            <Notifications />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              marginRight: 10,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Creator />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default memo(HeaderBar);
