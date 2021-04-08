import React, {useEffect, memo} from 'react';
import {View, FlatList, Text, TouchableOpacity, Platform} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserComments} from '../../../redux/actions/CommentActions';
import {
  getUserCommentsSelector,
  getUserCommentsIsComplete,
} from '../../../redux/selectors/CommentSelectors';
import {selectCommentById} from '../../../redux/selectors/CommentSelectors';
import TimeAgo from '../../../components/TimeAgo';
import {push} from '../../../navigation/Ref';
import FeedFooter from '../../../components/Feed/FeedFooter';

const CommentRow = memo((props) => {
  const {commentId} = props;
  const comment = useSelector((state) => selectCommentById(state, commentId));
  const createdAt = comment?.created_at;
  const text = comment?.text;
  const voteCount = comment?.voteCount;
  const isCommentDeleted = comment?.isDeleted;
  const postId = comment?.post;
  const postTitle = comment?.postDetail?.title;
  const isPostDeleted = comment?.postDetail?.isDeleted;

  const textField = !isCommentDeleted ? (
    <Text
      ellipsizeMode={'tail'}
      numberOfLines={5}
      style={{padding: 5, color: '#333'}}>
      {text}
    </Text>
  ) : (
    <Text
      style={{
        padding: 5,
        color: '#ff6565',
        textDecorationLine: 'line-through',
      }}>
      {'comment deleted  '}
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
        color={'#888'}
      />
      <Text style={{fontSize: 12, color: '#444', paddingHorizontal: 4}}>
        {voteCount}
      </Text>
    </View>
  );

  const postTitleField = isPostDeleted ? (
    <Text
      style={{
        fontWeight: 'bold',
        color: '#ff6565',
        textDecorationLine: 'line-through',
      }}>
      {' '}
      post deleted{'  '}
    </Text>
  ) : (
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{fontWeight: 'bold', padding: 5, color: '#444'}}>
      {postTitle}
    </Text>
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
      disabled={isPostDeleted}
      style={{
        padding: 5,
        backgroundColor: isPostDeleted || isCommentDeleted ? '#fff5f5' : '#fff',
        borderRadius: 5,
        marginHorizontal: 3,
      }}
      onPress={() => push('PostDetail', {postId: postId})}>
      {postTitleField}
      {metadataRow}
      {textField}
    </TouchableOpacity>
  );
});

const separator = memo(() => {
  return <Divider style={{backgroundColor: '#fafafa', height: 5}} />;
});

const Comments = (props) => {
  const dispatch = useDispatch();

  const userId = props?.route?.params?.userId;

  const commentIds = useSelector((state) =>
    getUserCommentsSelector(state, userId),
  );
  const complete = useSelector((state) =>
    getUserCommentsIsComplete(state, userId),
  );
  console.log('running comments tab');

  useEffect(() => {
    dispatch(fetchUserComments(userId));
  }, []);

  const renderRow = ({item}) => {
    return <CommentRow commentId={item} />;
  };

  const handleLoadMore = () => {
    if (!complete) {
      dispatch(fetchUserComments(userId));
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        listKey="userCommentList"
        removeClippedSubviews={true}
        renderItem={renderRow}
        data={commentIds}
        removeClippedSubviews={Platform.OS == 'ios' ? false : true} // Pd: Don't enable this on iOS where this is buggy and views don't re-appear.
        ItemSeparatorComponent={separator}
        keyExtractor={(item, index) => item}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={500}
        windowSize={25}
        ListFooterComponent={<FeedFooter complete={complete} />}
      />
    </View>
  );
};

export default memo(Comments);
