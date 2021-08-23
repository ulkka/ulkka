import React, {memo, useEffect, useState, useContext} from 'react';
import {ScrollView, View, RefreshControl, Text, Image} from 'react-native';
import CommentList from '../components/Comment/CommentList';
import PostCard from '../components/Post/PostCard';
import CommentWriter from '../components/Comment/CommentWriter';
import {useDispatch, useSelector} from 'react-redux';
import {removePostDetail} from '../redux/reducers/FeedSlice';
import {refreshPostDetail, initPostDetail} from '../redux/actions/FeedActions';
import {getBlockedUsers} from '../redux/reducers/AuthSlice';
import {
  isFeedRefreshing,
  isFeedLoading,
} from '../redux/selectors/FeedSelectors';
import {
  getPostisDeleted,
  getPostisRemoved,
  getPostAuthorId,
} from '../redux/selectors/PostSelectors';
import {makeId} from '../components/Post/helpers';
import {goBack} from '../navigation/Ref';
import {Button, ThemeContext} from 'react-native-elements';

const PostDetail = ({route}) => {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();

  const {postId} = route?.params;
  const [commentId, setCommentId] = useState(route?.params?.commentId);
  const [screenId, setScreenId] = useState(undefined);
  const [error, setError] = useState(undefined);

  const isPostDeleted = useSelector(state => getPostisDeleted(state, postId));
  const isPostRemoved = useSelector(state => getPostisRemoved(state, postId));
  const refreshing = useSelector(state => isFeedRefreshing(state, screenId));
  const loading = useSelector(state => isFeedLoading(state, screenId));

  const blockedUsers = useSelector(getBlockedUsers);
  const postAuthorId = useSelector(state => getPostAuthorId(state, postId));
  const isAuthorBlocked = blockedUsers?.includes(postAuthorId);

  useEffect(() => {
    const newScreenId = 'PostDetail-' + postId + '-' + makeId(5);
    setScreenId(newScreenId);

    return () => dispatch(removePostDetail(screenId));
  }, [postId]);

  useEffect(() => {
    loadPostDetail();
  }, [screenId]);

  const loadPostDetail = async () => {
    await dispatch(initPostDetail({screenId, postId}));

    isPostDeleted === undefined ? handleRefresh() : setError(false);
  };

  const handleRefresh = () => {
    dispatch(refreshPostDetail({type: screenId, postId})).then(res => {
      const err = res.error !== undefined;
      setError(err);
    });
  };

  const refreshingPostView = (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
      <Text
        style={{
          padding: 50,
          fontSize: 15,
          fontWeight: 'bold',
          color: theme.colors.black5,
        }}>
        {'  '}Loading...{'  '}
      </Text>
    </View>
  );
  const postView = (
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          alignSelf: 'center',
          borderBottomWidth: 1,
          borderColor: theme.colors.grey3,
          borderRadius: 10,
          backgroundColor: theme.colors.primary,
          width: '100%',
          flex: 1,
          marginBottom: 45,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <PostCard postId={postId} screen={'PostDetail'} screenId={screenId} />

        <CommentList
          postId={postId}
          key={postId}
          screenId={screenId}
          commentId={commentId}
          setCommentId={setCommentId}
        />
      </ScrollView>
      <CommentWriter postId={postId} />
    </View>
  );

  const postNotAvailableView = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: theme.colors.grey0,
      }}>
      <Text
        style={{fontWeight: 'bold', fontSize: 20, color: theme.colors.black5}}>
        {'  '}
        Post not available{'  '}
      </Text>
      <Button
        title="Go Back"
        type="outline"
        raised
        titleStyle={{fontSize: 15, color: theme.colors.blue, padding: 4}}
        onPress={() => goBack()}
      />
    </View>
  );
  return !isAuthorBlocked
    ? loading || refreshing || error === undefined
      ? refreshingPostView
      : isPostDeleted === false && isPostRemoved === false
      ? postView
      : postNotAvailableView
    : postNotAvailableView;
};

export default memo(PostDetail);
