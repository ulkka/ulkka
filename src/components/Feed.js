import React, {useEffect, useContext} from 'react';
import {View, FlatList} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import Post from './Post/Post';
import FeedFooter from './FeedFooter';
import {useSelector, useDispatch} from 'react-redux';
import {
  isComplete,
  isLoading,
  resetFeed,
  makeFeed,
  fetchFeed,
  initialiseFeed,
} from '../redux/reducers/FeedSlice';

import {getAuthStatus} from '../redux/reducers/AuthSlice';

function Feed(props) {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();

  const screen = props.screen;

  const authStatus = useSelector(getAuthStatus);

  const loading = useSelector(isLoading(screen));
  const complete = useSelector(isComplete(screen));
  const postIds = useSelector(makeFeed(screen));

  console.log('running feed');

  useEffect(() => {
    if (authStatus != 'UNAUTHENTICATED') {
      dispatch(initialiseFeed(screen));
      dispatch(fetchFeed(screen));
    }
  }, [authStatus]);

  const renderRow = ({item}) => {
    return <Post postId={item} caller={screen} />;
  };
  const separator = () => {
    return <View style={{padding: 5}}></View>;
  };

  const handleLoadMore = () => {
    if (authStatus != 'UNAUTHENTICATED' && !complete && !loading) {
      dispatch(fetchFeed(screen));
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
        listKey={screen}
        data={postIds}
        renderItem={renderRow}
        ItemSeparatorComponent={separator}
        onEndReached={() => handleLoadMore()}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={100}
        windowSize={11}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        keyExtractor={(postId, index) => postId}
        ListFooterComponent={<FeedFooter complete={complete} />}
      />
    </View>
  );
}

export default Feed;
