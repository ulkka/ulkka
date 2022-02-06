import React, {useEffect, memo} from 'react';
import {View, FlatList, RefreshControl, Platform, Animated} from 'react-native';
import {useTheme} from 'react-native-elements';
import {useScrollToTop} from '@react-navigation/native';
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
import {useTranslation} from 'react-i18next';
import {t} from 'i18next';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const ListHeader = memo(props => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const {screen} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.grey1,
        alignItems: 'center',
      }}>
      <SortFeed screen={screen} />
    </View>
  );
});

function Feed(props) {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const {screen} = props;

  const screenType = screen.split('-')[0];

  const ref = React.useRef(null);

  (screenType == 'home' || screenType == 'popular') &&
    useScrollToTop(
      React.useRef({
        scrollToTop: () => {
          ref?.current?.scrollToOffset({offset: 0});
          props.showTabBar();
        },
      }),
    );

  const complete = useSelector(state => isFeedComplete(state, screen));
  const loading = useSelector(state => isFeedLoading(state, screen));
  const refreshing = useSelector(state => isFeedRefreshing(state, screen));
  const postIds = useSelector(state => getFeedPostIds(state, screen));

  const viewabilityConfigRef = React.useRef({
    minimumViewTime: 250,
    itemVisiblePercentThreshold: 30,
    waitForInteraction: false,
  });
  const onViewableItemsChangedRef = React.useRef(_onViewableItemsChanged());

  const topCommunitiesPosition = postIds?.length > 3 ? 3 : 0;

  useEffect(() => {
    handleInitialiseFeed();
    if (screenType !== 'home' && screenType !== 'popular') {
      return () => {
        dispatch(removeFeed(screen));
      };
    }
  }, [screen]);

  const handleInitialiseFeed = async () => {
    await dispatch(initialiseFeed(screen));
    handleFetchFeed();
  };

  const renderRow = ({item, index}) => {
    if (
      index == topCommunitiesPosition &&
      (screen == 'home' || screen == 'popular')
    ) {
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
    return items => {
      dispatch(setViewableItems({items: items, type: screen}));
    };
  }

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <AnimatedFlatList
        ListHeaderComponent={memo(() => (
          <ListHeader screen={screen} />
        ))}
        ref={ref}
        listKey={screen}
        data={postIds}
        renderItem={renderRow}
        onEndReached={handleLoadMore}
        ListEmptyComponent={() => {
          if (screenType == 'home' && loading == false && complete == true) {
            return <TopCommunities />;
          } else {
            return <View></View>;
          }
        }}
        onEndReachedThreshold={screenType == 'home' ? 0.7 : 0.5} //How far from the end (important note: in units of visible length of the list) the bottom edge of the list must be from the end of the content to trigger the onEndReached callback
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
            text={t('No more posts')}
          />
        ))}
        onScrollToIndexFailed={info =>
          console.info('scroll to index failed', info)
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
