import React, {useEffect, useContext} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import Post from './Post';
import FeedFooter from './FeedFooter';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectPostIds,
  fetchPosts,
  isComplete,
  isLoading,
} from '../redux/reducers/PostSlice';
import {getAuthStatus} from '../redux/reducers/AuthSlice';

function Feed(props) {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();

  const postIds = useSelector(selectPostIds);
  const authStatus = useSelector(getAuthStatus);
  const loading = useSelector(isLoading);
  const complete = useSelector(isComplete);

  useEffect(() => {
    if (authStatus != 'UNAUTHENTICATED') {
      dispatch(fetchPosts(props.screen));
    }
  }, [authStatus]);

  const renderRow = ({item}) => {
    return (
      <Post item={item} navigation={props.navigation} caller={props.screen} />
    );
  };
  const separator = () => {
    return <View style={{padding: 5}}></View>;
  };

  const handleLoadMore = () => {
    if (authStatus != 'UNAUTHENTICATED' && !complete && !loading) {
      dispatch(fetchPosts(props.screen));
    }
  };

  const ListHeaderComponent = () => {
    return (
      <View
        style={{
          height: 10,
          backgroundColor: '#fff',
        }}></View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        listKey={props.screen}
        data={postIds}
        renderItem={renderRow}
        ItemSeparatorComponent={separator}
        onEndReached={() => handleLoadMore()}
        onEndReachedThreshold={0.1}
        //  initialNumToRender={5}
        //  maxToRenderPerBatch={5}
        keyExtractor={(item, index) => item}
        ListFooterComponent={<FeedFooter complete={complete} />}
      />
    </View>
  );
}

export default Feed;
