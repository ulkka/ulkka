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
import SingleCommentThread from './SingleCommentThread';
import {Divider} from 'react-native-elements';

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

  function multiCommentThread() {
    return parentCommentIds !== undefined
      ? parentCommentIds.map((commentId, index) => {
          return (
            <View key={commentId}>
              <SingleCommentThread commentId={commentId} key={commentId} />
              <Divider style={{backgroundColor: '#eee', height: 5}} />
            </View>
          );
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
        paddingBottom: 10,
      }}>
      <CommentListTitle />
      {multiCommentThread()}
    </View>
  );
}

export default CommentList;
