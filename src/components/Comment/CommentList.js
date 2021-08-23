import React, {useEffect} from 'react';
import {View, Image, Text, Platform} from 'react-native';
import {useTheme} from 'react-native-elements';
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
  const {theme} = useTheme();
  const {postId, screenId, commentId, setCommentId} = props;

  const loading = useSelector(state => areCommentsLoading(state, postId));
  const parentCommentIds = useSelector(state =>
    getParentCommentIdsOfPost(state, postId),
  );

  const refreshing = useSelector(state => isFeedRefreshing(state, screenId));

  const isRegistered = useSelector(getRegistrationStatus);

  useEffect(() => {
    if (refreshing) {
      dispatch(refreshComments(postId));
    }
  }, [refreshing]);

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [isRegistered]);

  const LoadingView = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 25,
        paddingBottom: 100,
      }}>
      <Image
        source={require('../../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
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
              level={0}
            />
            <Divider color={theme.colors.grey2} />
          </View>
        );
      })
    );
  }

  function singleCommentThread() {
    return (
      <View key={commentId}>
        <SingleCommentThread
          commentId={commentId}
          key={commentId}
          postId={postId}
          level={0}
        />
        <Divider color={theme.colors.grey2} />
      </View>
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
          color: theme.colors.black5,
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
        marginBottom: Platform.OS == 'ios' ? 15 : 15,
        borderBottomColor: theme.colors.grey3,
        borderBottomWidth: 1,
      }}>
      <CommentListTitle commentId={commentId} setCommentId={setCommentId} />
      {commentId ? singleCommentThread() : multiCommentThread()}
    </View>
  );

  return loading || refreshing
    ? LoadingView
    : parentCommentIds?.length == 0
    ? emptyCommentView
    : nonEmptyCommentView;
}

export default CommentList;
