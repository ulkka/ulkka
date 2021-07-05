import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Keyboard} from 'react-native';
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
import {useIsFocused} from '@react-navigation/native';
import {goBack} from '../navigation/Ref';

export default function Search() {
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

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

  useEffect(() => {
    if (isFocused) {
      layout && searchRef.current.focus();
    } else {
      setLayout(false);
    }
  }, [isFocused]);

  const cancelSearchHandler = () => {
    dispatch(resetSearch());
    goBack();
    // Keyboard.dismiss();
  };

  return (
    //searchMode ? (
    <View
      style={{
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: getStatusBarHeight(true) + 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
      }}>
      <SearchBar
        // autoFocus={true}
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
        onClear={() => {
          serverSearch && dispatch(setServerSearch(false));
          searchRef.current.focus();
        }}
        onSubmitEditing={() => dispatch(setServerSearch(true))}
      />
      {
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
      }
    </View>
  ); //: (
  // <View></View>
  // );
}
