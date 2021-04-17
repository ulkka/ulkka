import React, {useState, memo} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import Search from './Search';
import {showAuthScreen, push} from '../navigation/Ref';
import {useSelector} from 'react-redux';
import {
  getRegistrationStatus,
  getRegisteredUser,
} from '../redux/reducers/AuthSlice';
import UserAvatar from './UserAvatar';

const HeaderBar = (props) => {
  const [searchMode, setSearchMode] = useState(false);
  const isRegistered = useSelector(getRegistrationStatus);
  const registeredUser = useSelector(getRegisteredUser);
  const _toggleSearch = () => setSearchMode(!searchMode);

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

  const TitleComponent = () => {
    return searchMode == false ? (
      <SafeAreaView
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 19,
            fontFamily:
              Platform.OS == 'ios' ? 'Verdana' : 'sans-serif-condensed',
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
    ) : (
      <Search />
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
        <AccountComponent />
        <TitleComponent />
        <SearchComponent />
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default memo(HeaderBar);
