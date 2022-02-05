import React, {memo} from 'react';
import {TouchableOpacity, Platform, Image, View} from 'react-native';
import {Icon, Text, useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {
  getRegistrationStatus,
  getRegisteredUser,
} from '../redux/reducers/AuthSlice';
import UserAvatar from './UserAvatar';
import {getUserTotalKarma} from '../redux/reducers/UserSlice';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {kFormatter} from './helpers';
import ReferralButton from './ReferralButton';
import CommunityExplorerButton from './CommunityExplorerButton';

const TitleComponent = memo(() => {
  const {theme} = useTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <Text
        style={{
          fontSize: 25,
          fontFamily:
            Platform.OS == 'ios' ? 'chalkduster' : 'sans-serif-medium',
          fontWeight: Platform.OS == 'ios' ? '500' : 'bold',
          color: theme.colors.black4,
        }}>
        OM
      </Text>
      <Image
        resizeMode={'contain'}
        source={require('../../assets/ulkka_title_transparent.png')}
        style={{
          height: 30,
          width: 30,
          marginLeft: 0,
        }}
      />
      <Text
        style={{
          fontSize: 25,
          fontFamily:
            Platform.OS == 'ios' ? 'chalkduster' : 'sans-serif-medium',
          fontWeight: Platform.OS == 'ios' ? '500' : 'bold',
          color: theme.colors.black4,
        }}>
        NG
      </Text>
    </View>
  );
});

const UserKarma = ({userId}) => {
  const {theme} = useTheme();
  const karma = useSelector(state => getUserTotalKarma(state, userId));
  return (
    <Text
      style={{
        fontWeight: 'bold',
        fontSize: 14,
        color: theme.colors.black3,
        ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
      }}>
      {kFormatter(karma)}
    </Text>
  );
};

const HeaderBar = props => {
  const {theme} = useTheme();
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
          <UserKarma userId={registeredUser?._id} />
          <View style={{width: 5}}></View>
          <Icon name={'heart'} color={'red'} type="font-awesome" size={14} />
        </View>
      </View>
    ) : (
      <Icon
        name="account"
        type="material-community"
        color={theme.colors.black5}
        size={25}
      />
    );

    return (
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 10, left: 20, right: 40}}
        onPress={() => {
          props.navigation.openDrawer();
        }}>
        {avatar}
      </TouchableOpacity>
    );
  };

  const headerRight = (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
      {/* <CommunityExplorerButton /> */}
      <View style={{width: 18}} />
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
        backgroundColor: theme.colors.primary,
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
        backgroundColor: theme.colors.primary,
        paddingBottom: 2,
        // will be 0 on Android, because You pass true to skipAndroid
        paddingTop: getStatusBarHeight(true),
      }}>
      {headerContents}
    </View>
  );
};

export default memo(HeaderBar);
