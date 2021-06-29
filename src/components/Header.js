import React, {memo} from 'react';
import {TouchableOpacity, StatusBar, Platform, Image, View} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {showAuthScreen, push} from '../navigation/Ref';
import {useSelector} from 'react-redux';
import {
  getRegistrationStatus,
  getRegisteredUser,
} from '../redux/reducers/AuthSlice';
import UserAvatar from './UserAvatar';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {kFormatter} from './helpers';
import ReferralButton from './ReferralButton';

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
      <Text
        style={{
          fontSize: 19,
          fontFamily: Platform.OS == 'ios' ? 'Verdana' : 'sans-serif-condensed',
          fontWeight: Platform.OS == 'ios' ? '500' : 'bold',
          color: '#424242',
        }}>
        Ulkka
      </Text>
      <Image
        resizeMode={'contain'}
        source={require('../../assets/ulkka_title_transparent.png')}
        style={{height: 23, width: 24, marginLeft: 7}}
      />
    </View>
  );
});

const HeaderBar = (props) => {
  const isRegistered = useSelector(getRegistrationStatus);
  const registeredUser = useSelector(getRegisteredUser);

  const AccountComponent = () => {
    const avatar = isRegistered ? (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <UserAvatar seed={registeredUser.displayname} size="header" />
        <View
          style={{
            paddingHorizontal: 7,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              color: '#333',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {kFormatter(registeredUser.postKarma + registeredUser.commentKarma)}
          </Text>
          <View style={{width: 5}}></View>
          <Icon name={'heart'} color={'red'} type="font-awesome" size={14} />
        </View>
      </View>
    ) : (
      <Icon name="account" type="material-community" color={'#555'} size={25} />
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

  const headerRight = (
    <View
      style={{
        flex: 1,
        alignItems: 'flex-end',
      }}>
      <ReferralButton />
    </View>
  );

  const headerLeft = (
    <View style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
      <AccountComponent />
    </View>
  );
  const headerCenter = (
    <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
      <TitleComponent />
    </View>
  );

  const headerContents = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 8,
        marginTop: Platform.OS == 'ios' ? 5 : 8,
        marginBottom: Platform.OS == 'ios' ? 8 : 5,
        justifyContent: 'center',
      }}>
      {headerLeft}
      {headerCenter}
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
