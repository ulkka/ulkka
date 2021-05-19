import React, {useEffect, useContext, memo} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Platform,
  Animated,
  Text,
} from 'react-native';
import {ThemeContext, Divider, Icon} from 'react-native-elements';
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
import TopCommunities from '../../components/TopCommunities';
import SortFeed from './SortFeed';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ListHeaderComponent = memo(() => {
  return (
    <View
      style={{
        height: 2,
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

  const topCommunitiesPosition = postIds?.length > 3 ? 3 : 0;

  console.log('running feed', screen);

  useEffect(() => {
    handleInitialiseFeed();
    return () => dispatch(removeFeed(screen));
  }, []);

  const handleInitialiseFeed = async () => {
    await dispatch(initialiseFeed(screen));
    handleFetchFeed();
  };

  const renderRow = ({item, index}) => {
    if (index == topCommunitiesPosition && screen == 'home') {
      return (
        <View>
          <TopCommunities />
          <PostCard postId={item} screen={screen} />
        </View>
      );
    } else return <PostCard postId={item} screen={screen} />;
  };

  const handleLoadMore = () => {
    if (!complete && !loading) {
      handleFetchFeed();
    }
  };

  const handleFetchFeed = () => {
    dispatch(fetchFeed(screen));
  };

  const handleRefresh = () => {
    dispatch(refreshFeed(screen));
  };

  function _onViewableItemsChanged() {
    return (items) => {
      dispatch(setViewableItems({items: items, type: screen}));
    };
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <AnimatedFlatList
        ListHeaderComponent={memo(() => (
          <SortFeed screen={screen} />
        ))}
        ref={feedListRef}
        listKey={screen}
        data={postIds}
        renderItem={renderRow}
        // ItemSeparatorComponent={separator}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={screen == 'home' ? 0.7 : 0.5} //How far from the end (important note: in units of visible length of the list) the bottom edge of the list must be from the end of the content to trigger the onEndReached callback
        removeClippedSubviews={Platform.OS == 'ios' ? false : true} // Pd: Don't enable this on iOS where this is buggy and views don't re-appear.
        updateCellsBatchingPeriod={500}
        windowSize={15}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        keyExtractor={(postId, index) => postId}
        ListFooterComponent={memo(() => (
          <FeedFooter
            complete={complete}
            loading={loading && !refreshing}
            text="No more posts"
          />
        ))}
        onScrollToIndexFailed={(info) =>
          console.log('scroll to index failed', info)
        }
        refreshControl={
          <RefreshControl
            progressViewOffset={
              props.contentContainerStyle?.paddingTop
                ? props.contentContainerStyle?.paddingTop + 50
                : 0
            }
            refreshing={refreshing ? refreshing : false}
            onRefresh={handleRefresh}
          />
        }
        {...props}
      />
    </View>
  );
}

export default memo(Feed);
