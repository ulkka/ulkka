import React, {useState} from 'react';
import {SafeAreaView, TouchableOpacity, StatusBar} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import Search from './Search';
import {showAuthScreen} from '../navigation/Ref';
import {useSelector} from 'react-redux';
import {getRegistrationStatus} from '../redux/reducers/AuthSlice';

const HeaderBar = (props) => {
  const [searchMode, setSearchMode] = useState(false);
  const isRegistered = useSelector(getRegistrationStatus);
  const _toggleSearch = () => setSearchMode(!searchMode);

  const AccountComponent = () => {
    return (
      <TouchableOpacity
        style={{paddingLeft: 5}}
        onPress={() => showAuthScreen()}>
        <Icon
          name="user-alt"
          type="font-awesome-5"
          color={isRegistered ? 'green' : '#444'}
          size={18}
        />
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
            fontSize: 17,
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
      <Icon name="search" color="#333" onPress={() => _toggleSearch()} />
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
          margin: 10,
        }}>
        <AccountComponent />
        <TitleComponent />
        <SearchComponent />
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default HeaderBar;
