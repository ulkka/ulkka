import React, {useEffect, useContext, memo} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {ThemeContext, Divider} from 'react-native-elements';
import Post from './Post/Post';
import FeedFooter from './FeedFooter';
import {useSelector, useDispatch} from 'react-redux';
import {isComplete, isLoading} from '../redux/selectors/FeedSelectors';
import {selectFlatPosts} from '../redux/selectors/PostSelectors';
import {initialiseFeed} from '../redux/reducers/FeedSlice';
import {fetchFeed} from '../redux/actions/FeedActions';
import {getAuthStatus} from '../redux/reducers/AuthSlice';
import CreatePostButtonOverlay from '../components/Post/CreatePostButtonOverlay';
import ScrollToTop from './ScrollToTop';
import {scaleHeightAndWidthAccordingToDimensions} from './Post/helpers';

function Feed(props) {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();
  const feedListRef = React.createRef();

  const screen = props.screen;

  const authStatus = useSelector(getAuthStatus);

  const loading = useSelector(isLoading(screen));
  const complete = useSelector(isComplete(screen));
  const posts = useSelector(selectFlatPosts(screen));

  console.log('running feed');

  useEffect(() => {
    if (authStatus != 'UNAUTHENTICATED') {
      dispatch(initialiseFeed(screen));
      dispatch(fetchFeed(screen));
    }
  }, [authStatus]);

  const renderRow = ({item}) => {
    const {
      _id,
      created_at,
      title,
      type,
      description,
      link,
      mediaMetadata,
      ogData,
      userVote,
      voteCount,
      commentCount,
      communityDetail,
      authorDetail,
    } = item;

    const {_id: communityId, name: communityName} = communityDetail;
    const {_id: authorId, displayname: authorDisplayname} = authorDetail;

    let {height, width} = scaleHeightAndWidthAccordingToDimensions(
      mediaMetadata,
    );

    return (
      <Post
        postId={_id}
        caller={screen}
        communityName={communityName}
        communityId={communityId}
        authorDisplayname={authorDisplayname}
        authorId={authorId}
        created_at={created_at}
        title={title}
        type={type}
        description={description}
        mediaMetadata={mediaMetadata}
        height={height}
        width={width}
        ogData={ogData}
        link={link}
        userVote={userVote}
        voteCount={voteCount}
        commentCount={commentCount}
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
        windowSize={15} // causes flickering with read more text while scrolling up, fix that before uncommenting
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        keyExtractor={(post, index) => post._id}
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

export default memo(Feed);
