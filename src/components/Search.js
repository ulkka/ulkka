import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getSearchTerm,
  setSearchTerm,
  getServerSearch,
  setServerSearch,
  setSearchMode,
  getSearchMode,
  resetSearch,
} from '../redux/reducers/SearchSlice';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {navigate} from '../navigation/Ref';

export default function Search() {
  const dispatch = useDispatch();

  const term = useSelector(getSearchTerm);
  const serverSearch = useSelector(getServerSearch);
  const searchMode = useSelector(getSearchMode);
  const [layout, setLayout] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    dispatch(setSearchMode(true));
  }, []);

  useEffect(() => {
    if (layout) {
      searchRef.current.focus();
    }
  }, [layout]);

  const cancelSearchHandler = () => {
    dispatch(resetSearch());
    navigate('HomeFeed');
  };

  return searchMode ? (
    <View
      style={{
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: getStatusBarHeight(true) + 10,
        // padding: 5,
        paddingBottom: 10,
        paddingHorizontal: 10,
      }}>
      <SearchBar
        ref={searchRef}
        onLayout={() => setLayout(true)}
        onFocus={() => serverSearch && dispatch(setServerSearch(false))}
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
        returnKeyType="search"
        onSubmitEditing={() => dispatch(setServerSearch(true))}
      />
      <TouchableOpacity
        style={{paddingRight: 5, paddingLeft: 10}}
        onPress={cancelSearchHandler}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: '#555',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View></View>
  );
}
