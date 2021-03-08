import React, {useEffect, useContext} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {ThemeContext, Divider} from 'react-native-elements';
import Post from './Post/Post';
import FeedFooter from './FeedFooter';
import {useSelector, useDispatch} from 'react-redux';
import {
  isComplete,
  isLoading,
  makeFeed,
} from '../redux/selectors/FeedSelectors';
import {initialiseFeed} from '../redux/reducers/FeedSlice';
import {fetchFeed} from '../redux/actions/FeedActions';
import {getAuthStatus} from '../redux/reducers/AuthSlice';
import CreatePostButtonOverlay from '../components/Post/CreatePostButtonOverlay';
import ScrollToTop from './ScrollToTop';

function Feed(props) {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();
  const feedListRef = React.createRef();

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
    return <Divider style={{backgroundColor: '#eee', height: 5}} />;
  };

  const handleLoadMore = () => {
    if (authStatus != 'UNAUTHENTICATED' && !complete && !loading) {
      dispatch(fetchFeed(screen));
    }
  };

  const refreshFeed = () => {
    console.log('refreshing feed');
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
        ref={feedListRef}
        listKey={screen}
        data={postIds}
        renderItem={renderRow}
        ItemSeparatorComponent={separator}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={100}
        //windowSize={11} // causes flickering with read more text while scrolling up, fix that before uncommenting
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        keyExtractor={(postId, index) => postId}
        ListFooterComponent={<FeedFooter complete={complete} />}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshFeed} />
        }
      />
      <CreatePostButtonOverlay />
      <ScrollToTop listRef={feedListRef} />
    </View>
  );
}

export default Feed;
