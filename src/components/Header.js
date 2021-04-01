import React, {useState, memo} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
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
        color={'#77c063'}
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
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: Platform.OS == 'ios' ? 17 : 16,
            fontWeight: 'bold',
            color: '#333',
          }}>
          Vellarikka Pattanam
        </Text>
      </SafeAreaView>
    ) : (
      <Search />
    );
  };

  const SearchComponent = () => {
    return searchMode == false ? (
      <Icon
        name="search"
        color="#333"
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
      <StatusBar barStyle="dark-content" />
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
