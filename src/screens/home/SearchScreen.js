import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {getServerSearch, resetSearch} from '../../redux/reducers/SearchSlice';
import ServerSearchTabNavigation from './ServerSearchTabNavigation';
import LocalSearch from './LocalSearch';
import SearchBar from '../../components/Search';

export default function SearchScreen(props) {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const serverSearch = useSelector(getServerSearch);
  useEffect(() => {
    return () => dispatch(resetSearch());
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}>
      <SearchBar />
      {serverSearch ? <ServerSearchTabNavigation /> : <LocalSearch />}
    </View>
  );
}
