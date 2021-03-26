import React, {useEffect} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  getParentCommentIdsOfPost,
  areCommentsLoading,
} from '../../redux/selectors/CommentSelectors';
import {isFeedRefreshing} from '../../redux/selectors/FeedSelectors';
import {
  fetchComments,
  refreshComments,
} from '../../redux/actions/CommentActions';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';
import CommentListTitle from './CommentListTitle';
import SingleCommentThread from './SingleCommentThread';
import {Divider} from 'react-native-elements';

function CommentList(props) {
  const dispatch = useDispatch();

  const {postId, screenId} = props;

  const loading = useSelector((state) => areCommentsLoading(state, postId));
  const parentCommentIds = useSelector((state) =>
    getParentCommentIdsOfPost(state, postId),
  );

  const refreshing = useSelector((state) => isFeedRefreshing(state, screenId));

  const isRegistered = useSelector(getRegistrationStatus);

  useEffect(() => {
    if (refreshing) {
      dispatch(refreshComments(postId));
    }
  }, [refreshing]);

  useEffect(() => {
    dispatch(fetchComments({postId: postId}));
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
    return (
      parentCommentIds &&
      parentCommentIds.map((commentId, index) => {
        return (
          <View key={commentId}>
            <SingleCommentThread
              commentId={commentId}
              key={commentId}
              postId={postId}
            />
            <Divider style={{backgroundColor: '#fafafa', height: 5}} />
          </View>
        );
      })
    );
  }

  const emptyCommentView = (
    <View
      style={{
        marginTop: '10%',
        marginBottom: 45,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: '#555',
          fontWeight: 'bold',
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 30,
        }}>
        No comments yet {'\n'}Be the first to comment!{'  '}
      </Text>
    </View>
  );

  const nonEmptyCommentView = (
    <View
      style={{
        marginBottom: 25,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
      }}>
      <CommentListTitle />
      {multiCommentThread()}
    </View>
  );

  return loading || refreshing
    ? LoadingView
    : parentCommentIds?.length == 0
    ? emptyCommentView
    : nonEmptyCommentView;
}

export default CommentList;
