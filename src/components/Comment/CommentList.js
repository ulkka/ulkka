import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchComments,
  isLoading,
  getParentComments,
} from '../../redux/reducers/CommentSlice';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';
import CommentListTitle from './CommentListTitle';
import CommentTree from './CommentTree';

function CommentList(props) {
  const dispatch = useDispatch();

  const loading = useSelector(isLoading);
  const isRegistered = useSelector(getRegistrationStatus);
  const parentCommentIds = useSelector(getParentComments);

  useEffect(() => {
    dispatch(fetchComments(props.postId));
  }, [isRegistered]);

  const LoadingView = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
      }}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  );

  function renderComments() {
    return parentCommentIds !== undefined
      ? parentCommentIds.map((commentId, index) => {
          return <CommentTree commentId={commentId} key={commentId} />;
        })
      : null;
  }

  return loading ? (
    LoadingView
  ) : (
    <View
      style={{
        marginBottom: 25,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
      }}>
      <CommentListTitle />
      {renderComments()}
    </View>
  );
}

export default CommentList;
