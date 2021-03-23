import React, {useEffect, useContext, memo} from 'react';
import {View, FlatList, RefreshControl, Platform} from 'react-native';
import {ThemeContext, Divider} from 'react-native-elements';
import Post from './Post/Post';
import FeedFooter from './FeedFooter';
import {useSelector, useDispatch} from 'react-redux';
import {isFeedComplete, getFeedPostIds} from '../redux/selectors/FeedSelectors';
import {
  initialiseFeed,
  removeFeed,
  setViewableItems,
} from '../redux/reducers/FeedSlice';
import {fetchFeed} from '../redux/actions/FeedActions';
import {getAuthStatus} from '../redux/reducers/AuthSlice';
import ScrollToTop from './ScrollToTop';

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
  dispatch(initialiseFeed(screen));

  const authStatus = useSelector(getAuthStatus);

  const complete = useSelector((state) => isFeedComplete(state, screen));
  const postIds = useSelector((state) => getFeedPostIds(state, screen));

  const viewabilityConfigRef = React.useRef({
    minimumViewTime: 250,
    viewAreaCoveragePercentThreshold: 50,
    waitForInteraction: true,
  });
  const onViewableItemsChangedRef = React.useRef(_onViewableItemsChanged());

  const feedListRef = React.createRef();

  console.log('running feed', screen);

  useEffect(() => {
    return () => dispatch(removeFeed(screen));
  }, []);

  useEffect(() => {
    if (authStatus != 'UNAUTHENTICATED') {
      dispatch(fetchFeed(screen));
    }
  }, [authStatus]);

  const renderRow = ({item}) => {
    return <Post postId={item} screen={screen} />;
  };

  const handleLoadMore = () => {
    if (authStatus != 'UNAUTHENTICATED' && !complete) {
      dispatch(fetchFeed(screen));
    }
  };

  const refreshFeed = () => {
    console.log('refreshing feed');
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
        onEndReachedThreshold={screen == 'home' ? 0.5 : 0.1}
        removeClippedSubviews={Platform.OS == 'ios' ? false : true} // Pd: Don't enable this on iOS where this is buggy and views don't re-appear.
        updateCellsBatchingPeriod={500}
        windowSize={25}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        keyExtractor={(postId, index) => postId}
        ListFooterComponent={<FeedFooter complete={complete} />}
        onScrollToIndexFailed={(info) =>
          console.log('scroll to index failed', info)
        }
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshFeed} />
        }
      />
      <ScrollToTop
        listRef={feedListRef}
        visible={screen == 'home' && postIds?.length ? true : false}
      />
    </View>
  );
}

export default memo(Feed);
