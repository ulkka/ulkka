import React, {useEffect, memo, useContext} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  Animated,
} from 'react-native';
import {Divider, Icon, ThemeContext} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserComments} from '../../../redux/actions/CommentActions';
import {
  getUserCommentsSelector,
  getUserCommentsIsComplete,
  getUserCommentsIsLoading,
} from '../../../redux/selectors/CommentSelectors';
import {selectCommentById} from '../../../redux/selectors/CommentSelectors';
import TimeAgo from '../../../components/TimeAgo';
import {push} from '../../../navigation/Ref';
import FeedFooter from '../../../components/Feed/FeedFooter';
import analytics from '@react-native-firebase/analytics';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const CommentRow = memo(props => {
  const {theme} = useContext(ThemeContext);

  const {commentId} = props;
  const comment = useSelector(state => selectCommentById(state, commentId));
  const createdAt = comment?.created_at;
  const text = comment?.text;
  const voteCount = comment?.voteCount;
  const isCommentDeleted = comment?.isDeleted;
  const isCommentRemoved = comment?.isRemoved;
  const postId = comment?.post;
  const postTitle = comment?.postDetail?.title;
  const isPostDeleted = comment?.postDetail?.isDeleted;
  const isPostRemoved = comment?.postDetail?.isRemoved;

  const textField = !isCommentDeleted ? (
    <Text
      ellipsizeMode={'tail'}
      numberOfLines={5}
      style={{padding: 5, color: theme.colors.black3}}>
      {text}
    </Text>
  ) : (
    <Text
      style={{
        padding: 5,
        color: 'red',
        textDecorationLine: 'line-through',
        ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
      }}>
      {'comment deleted'}
    </Text>
  );

  const voteCountField = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon
        name={
          voteCount >= 0 ? 'arrow-up-bold-outline' : 'arrow-down-bold-outline'
        }
        type="material-community"
        size={14}
        color={theme.colors.black8}
      />
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.black4,
          paddingHorizontal: 4,
        }}>
        {voteCount}
      </Text>
    </View>
  );

  const postTitleField =
    isPostDeleted || isPostRemoved ? (
      <Text
        style={{
          fontWeight: 'bold',
          color: 'red',
          textDecorationLine: 'line-through',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {isPostDeleted ? 'post deleted' : 'post removed'}
      </Text>
    ) : (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{fontWeight: 'bold', padding: 5, color: theme.colors.black4}}>
          {postTitle}
        </Text>
        {isCommentRemoved && (
          <View
            style={{
              backgroundColor: 'rgba(256, 0, 0, 0.5)',
              padding: 3,
              borderRadius: 5,
            }}>
            <Text style={{fontSize: 10, color: theme.colors.black4}}>
              Comment Removed
            </Text>
          </View>
        )}
      </View>
    );

  const metadataRow = (
    <View style={{flexDirection: 'row', paddingHorizontal: 5}}>
      <TimeAgo time={createdAt} size={12} />
      <View
        style={{
          paddingHorizontal: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="circle" type="font-awesome" size={4} color="#888" />
      </View>
      {voteCountField}
    </View>
  );

  return (
    <TouchableOpacity
      disabled={isPostDeleted || isPostRemoved}
      style={{
        padding: 5,
        backgroundColor:
          isPostDeleted || isCommentDeleted
            ? theme.colors.reddishWhite
            : theme.colors.primary,
        borderRadius: 5,
        marginHorizontal: 3,
      }}
      onPress={() => {
        analytics().logEvent('postdetail_clickedfrom', {
          clicked_from: 'user_comments',
          screen: 'UserDetail',
        });
        push('PostDetail', {postId: postId});
      }}>
      {postTitleField}
      {metadataRow}
      {textField}
    </TouchableOpacity>
  );
});

const separator = memo(() => {
  const {theme} = useContext(ThemeContext);

  return <Divider style={{backgroundColor: theme.colors.grey0, height: 5}} />;
});

const Comments = props => {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();

  const userId = props.userId;

  const commentIds = useSelector(state =>
    getUserCommentsSelector(state, userId),
  );
  const complete = useSelector(state =>
    getUserCommentsIsComplete(state, userId),
  );
  const loading = useSelector(state => getUserCommentsIsLoading(state, userId));

  useEffect(() => {
    dispatch(fetchUserComments(userId));
  }, []);

  const renderRow = ({item}) => {
    return <CommentRow commentId={item} />;
  };

  const handleLoadMore = () => {
    if (!complete && !loading) {
      dispatch(fetchUserComments(userId));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}>
      <AnimatedFlatList
        listKey="userCommentList"
        renderItem={renderRow}
        data={commentIds}
        removeClippedSubviews={Platform.OS != 'ios'} // Pd: Don't enable this on iOS where this is buggy and views don't re-appear. user comment wont show scroll started
        ItemSeparatorComponent={separator}
        keyExtractor={(item, index) => item}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={500}
        windowSize={11}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <FeedFooter
            complete={complete}
            loading={loading}
            text={
              complete && !commentIds.length
                ? 'No Comments Yet'
                : 'No more comments'
            }
          />
        }
        {...props}
      />
      {!complete && loading && (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.primary,
            alignSelf: 'center',
          }}>
          <Image
            source={require('../../../../assets/loading.gif')}
            style={{height: 40, width: 40, paddingTop: 20}}
          />
        </View>
      )}
    </View>
  );
};

export default memo(Comments);
