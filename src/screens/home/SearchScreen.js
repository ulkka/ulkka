import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getServerSearch, resetSearch} from '../../redux/reducers/SearchSlice';
import ServerSearchTabNavigation from './ServerSearchTabNavigation';
import LocalSearch from './LocalSearch';

export default function SearchScreen(props) {
  const dispatch = useDispatch();
  const serverSearch = useSelector(getServerSearch);
  useEffect(() => {
    return () => dispatch(resetSearch());
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      {serverSearch ? <ServerSearchTabNavigation /> : <LocalSearch />}
    </View>
  );
}
