import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchComments,
  isLoading,
  selectCommentIds,
  getCommentParent,
} from '../../redux/reducers/CommentSlice';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';
import CommentListTitle from './CommentListTitle';
import CommentTree from './CommentTree';

export default function CommentList(props) {
  const dispatch = useDispatch();

  const loading = useSelector(isLoading);
  const isRegistered = useSelector(getRegistrationStatus);
  const allCommentIds = useSelector(selectCommentIds);

  useEffect(() => {
    dispatch(fetchComments(props.postId));
  }, [isRegistered]);

  function CommentThread() {
    return allCommentIds.map((commentId, index) => {
      const parent = useSelector((state) => getCommentParent(state, commentId));
      if (parent == undefined) {
        return (
          <CommentTree commentId={commentId} index={index} key={commentId} />
        );
      }
    });
  }

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
      <CommentThread />
    </View>
  );
}
