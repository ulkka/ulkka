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
import {showAuthScreen} from '../navigation/Ref';
import {useSelector} from 'react-redux';
import {
  getRegistrationStatus,
  getRegisteredUser,
} from '../redux/reducers/AuthSlice';

const HeaderBar = (props) => {
  const [searchMode, setSearchMode] = useState(false);
  const isRegistered = useSelector(getRegistrationStatus);
  const registeredUser = useSelector(getRegisteredUser);
  const _toggleSearch = () => setSearchMode(!searchMode);

  const AccountComponent = () => {
    return (
      <TouchableOpacity
        hitSlop={{top: 20, bottom: 30, left: 20, right: 40}}
        style={
          {
            //paddingLeft: 5
          }
        }
        onPress={() => showAuthScreen()}>
        {isRegistered ? (
          <FastImage
            style={{
              height: 36,
              width: 36,
              alignSelf: 'center',
            }}
            source={{
              uri:
                'http://avatars.dicebear.com/4.5/api/bottts/' +
                registeredUser?.displayname +
                '.png',
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : (
          <Icon
            name="user-alt"
            type="font-awesome-5"
            color={isRegistered ? '#77c063' : '#444'}
            size={18}
          />
        )}
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
        size={24}
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
          marginVertical: 10,
        }}>
        <AccountComponent />
        <TitleComponent />
        <SearchComponent />
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default memo(HeaderBar);
