import React, {useState} from 'react';
import {SafeAreaView, TouchableOpacity, StatusBar} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import Search from './Search';

const HeaderBar = (props) => {
  const [searchMode, setSearchMode] = useState(false);

  const _goBack = () => console.log('Went back');

  const _toggleSearch = () => setSearchMode(!searchMode);

  const _handleMore = () => console.log('Shown more');

  const MenuComponent = () => {
    return (
      <Icon
        name="menu"
        color="#333"
        onPress={() => props.navigation.toggleDrawer()}
      />
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
          Harsha
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
        <MenuComponent />
        <TitleComponent />
        <SearchComponent />
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default HeaderBar;
