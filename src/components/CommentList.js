import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Comment, CommentGroup} from './Comment';
import LoadingOverlay from '../components/LoadingOverlay';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchComments,
  selectCommentEntities,
  isLoading,
} from '../redux/reducers/CommentSlice';
import {selectUserEntities} from '../redux/reducers/UserReducer';
import {denormalize} from 'normalizr';
import {comment} from '../redux/schema/CommentSchema';

export default function CommentList(props) {
  const loading = useSelector(isLoading);

  const dispatch = useDispatch();

  const topLevelCommentIds = useSelector(
    (state) => state.comments.topLevelCommentIds,
  );
  const normalisedComments = useSelector(selectCommentEntities);
  const users = useSelector(selectUserEntities);
  const denormalizedComments = denormalize(
    {comments: topLevelCommentIds},
    {comments: [comment]},
    {comments: normalisedComments, users: users},
  );
  const comments = denormalizedComments.comments;

  useEffect(() => {
    dispatch(fetchComments(props.item));
  }, []);

  const CommentListTitle = (
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#eee',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#888',
          fontSize: 13,
          width: '100%',
        }}>
        Comments
      </Text>
    </View>
  );

  function CommentThread({comment, index}) {
    return (
      <Comment
        key={comment._id}
        comment={comment}
        post={props.item}
        index={index}>
        {comment.replies === undefined ? null : (
          <CommentGroup key={comment._id} parent={comment._id}>
            {comment.replies.map((reply, index) => {
              return (
                <CommentThread key={reply._id} comment={reply} index={index} />
              );
            })}
          </CommentGroup>
        )}
      </Comment>
    );
  }

  function CommentListView() {
    return (
      <CommentGroup key={'root'} root={true} parent={'post'}>
        {comments.map((comment, index) => {
          return (
            <CommentThread key={comment._id} comment={comment} index={index} />
          );
        })}
      </CommentGroup>
    );
  }

  return loading ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
      }}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  ) : (
    <View key="commentListView">
      {CommentListTitle}
      <CommentListView />
    </View>
  );
}
