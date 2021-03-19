import React, {useEffect, useContext, memo} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {ThemeContext, Divider} from 'react-native-elements';
import Post from './Post/Post';
import FeedFooter from './FeedFooter';
import {useSelector, useDispatch} from 'react-redux';
import {
  isCompleteSelector,
  isLoadingSelector,
} from '../redux/selectors/FeedSelectors';
import {getFlatPostsSelector} from '../redux/selectors/PostSelectors';
import {initialiseFeed, setViewableItems} from '../redux/reducers/FeedSlice';
import {fetchFeed} from '../redux/actions/FeedActions';
import {getAuthStatus} from '../redux/reducers/AuthSlice';
import CreatePostButtonOverlay from '../components/Post/CreatePostButtonOverlay';
import ScrollToTop from './ScrollToTop';
import {scaleHeightAndWidthAccordingToDimensions} from './Post/helpers';

function Feed(props) {
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const {screen} = props;

  const authStatus = useSelector(getAuthStatus);

  const getIsLoading = isLoadingSelector();
  const getIsComplete = isCompleteSelector();
  const loading = useSelector((state) => getIsLoading(state, screen));
  const complete = useSelector((state) => getIsComplete(state, screen));

  const selectFlatPosts = getFlatPostsSelector();
  const posts = useSelector((state) => selectFlatPosts(state, screen));

  const viewabilityConfigRef = React.useRef({
    minimumViewTime: 750,
    viewAreaCoveragePercentThreshold: 50,
    waitForInteraction: true,
  });
  const onViewableItemsChangedRef = React.useRef(_onViewableItemsChanged());

  const feedListRef = React.createRef();

  console.log('running feed');

  useEffect(() => {
    if (authStatus != 'UNAUTHENTICATED') {
      dispatch(initialiseFeed(screen));
      dispatch(fetchFeed(screen));
    }
  }, [authStatus]);

  const renderRow = ({item}) => {
    const {_id, mediaMetadata, type, ogData} = item;

    let {height, width} =
      type == 'link'
        ? scaleHeightAndWidthAccordingToDimensions(ogData, 'og')
        : scaleHeightAndWidthAccordingToDimensions(mediaMetadata, 'media');

    return (
      <Post
        {...item}
        postId={_id}
        screen={screen}
        height={height}
        width={width}
      />
    );
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
        data={posts}
        renderItem={renderRow}
        ItemSeparatorComponent={separator}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={100}
        windowSize={21} // causes flickering with read more text while scrolling up, fix that before uncommenting
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        keyExtractor={(post, index) => post._id}
        ListFooterComponent={<FeedFooter complete={complete} />}
        onScrollToIndexFailed={(info) =>
          console.log('scroll to index failed', info)
        }
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshFeed} />
        }
      />
      <CreatePostButtonOverlay />
      <ScrollToTop listRef={feedListRef} />
    </View>
  );
}

export default memo(Feed);
