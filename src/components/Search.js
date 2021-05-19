import React, {useContext, useEffect, useState} from 'react';
import {SearchBar} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getSearchTerm,
  setSearchTerm,
  resetSearch,
  getServerSearch,
  setServerSearch,
} from '../redux/reducers/SearchSlice';

export default function Search() {
  const dispatch = useDispatch();

  const term = useSelector(getSearchTerm);
  const serverSearch = useSelector(getServerSearch);

  return (
    <SearchBar
      onFocus={() => serverSearch && dispatch(setServerSearch(false))}
      autoFocus={true}
      placeholder="Search..."
      onChangeText={(text) => dispatch(setSearchTerm(text))}
      value={term}
      lightTheme={true}
      containerStyle={{
        flex: 1,
        backgroundColor: 'white',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 0,
        height: 40,
      }}
      inputContainerStyle={{
        height: 40,
        backgroundColor: '#eee',
      }}
      inputStyle={{
        fontSize: 12,
        color: '#444',
      }}
      round={true}
      searchIcon={{size: 15}}
      showCancel={true}
    />
  );
}
