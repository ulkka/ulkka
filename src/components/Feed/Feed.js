import React, {useEffect, useContext, memo} from 'react';
import {View, FlatList, RefreshControl, Platform} from 'react-native';
import {ThemeContext, Divider} from 'react-native-elements';
import PostCard from '../Post/PostCard';
import FeedFooter from './FeedFooter';
import {useSelector, useDispatch} from 'react-redux';
import {
  isFeedComplete,
  getFeedPostIds,
  isFeedRefreshing,
  isFeedLoading,
} from '../../redux/selectors/FeedSelectors';
import {
  initialiseFeed,
  removeFeed,
  setViewableItems,
} from '../../redux/reducers/FeedSlice';
import {fetchFeed, refreshFeed} from '../../redux/actions/FeedActions';
import {getAuthStatus} from '../../redux/reducers/AuthSlice';
import ScrollToTop from './ScrollToTop';
import analytics from '@react-native-firebase/analytics';

const ListHeaderComponent = memo(() => {
  return (
    <View
      style={{
        height: 10,
        backgroundColor: '#fff',
      }}></View>
  );
});

const separator = memo(() => {
  return <Divider style={{backgroundColor: '#fafafa', height: 5}} />;
});

function Feed(props) {
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();

  const {screen} = props;
  const screenType = screen.split('-')[0];

  const authStatus = useSelector(getAuthStatus);

  const complete = useSelector((state) => isFeedComplete(state, screen));
  const loading = useSelector((state) => isFeedLoading(state, screen));
  const refreshing = useSelector((state) => isFeedRefreshing(state, screen));
  const postIds = useSelector((state) => getFeedPostIds(state, screen));

  const viewabilityConfigRef = React.useRef({
    minimumViewTime: 250,
    itemVisiblePercentThreshold: 30,
    waitForInteraction: false,
  });
  const onViewableItemsChangedRef = React.useRef(_onViewableItemsChanged());

  const feedListRef = React.createRef();

  console.log('running feed', screen);

  useEffect(() => {
    return () => dispatch(removeFeed(screen));
  }, []);

  useEffect(() => {
    if (authStatus != 'UNAUTHENTICATED') {
      dispatch(initialiseFeed(screen));
      fetch();
    }
  }, [authStatus]);

  const renderRow = ({item}) => {
    return <PostCard postId={item} screen={screen} />;
  };

  const handleLoadMore = () => {
    if (authStatus != 'UNAUTHENTICATED' && !complete && !loading) {
      fetch();
    }
  };

  const fetch = () => {
    dispatch(fetchFeed(screen)).then((res) => {
      const page = res.payload?.metadata?.page;
      const total = page && res.payload.metadata.total;
      const limit = page && res.payload.metadata.limit;
      page &&
        analytics().logEvent('feed_fetch', {
          page: res.payload.metadata.page,
          screen: screenType,
        });

      const isComplete = total <= limit * page;
      isComplete &&
        analytics().logEvent('feed_complete', {
          page: res.payload.metadata.page,
          screen: screenType,
          total: total,
        });
    });
  };

  const handleRefresh = () => {
    if (authStatus != 'UNAUTHENTICATED') {
      dispatch(refreshFeed(screen));
      analytics().logEvent('feed_refresh', {screen: screen});
    }
  };

  function _onViewableItemsChanged() {
    return (items) => {
      dispatch(setViewableItems({items: items, type: screen}));
    };
  }

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
        onEndReachedThreshold={screen == 'home' ? 0.9 : 0.1} //How far from the end (important note: in units of visible length of the list) the bottom edge of the list must be from the end of the content to trigger the onEndReached callback
        removeClippedSubviews={true} // Pd: Don't enable this on iOS where this is buggy and views don't re-appear.
        updateCellsBatchingPeriod={500}
        windowSize={15}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        keyExtractor={(postId, index) => postId}
        ListFooterComponent={
          <FeedFooter complete={complete} loading={loading && !refreshing} />
        }
        onScrollToIndexFailed={(info) =>
          console.log('scroll to index failed', info)
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing ? refreshing : false}
            onRefresh={handleRefresh}
          />
        }
      />
      <ScrollToTop
        listRef={feedListRef}
        visible={screen == 'home' && postIds?.length ? true : false}
        screen={screen}
      />
    </View>
  );
}

export default memo(Feed);
