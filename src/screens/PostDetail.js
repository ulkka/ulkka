import React, {memo, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import CommentList from '../components/Comment/CommentList';
import PostCard from '../components/Post/PostCard';
import CommentWriter from '../components/Comment/CommentWriter';
import {useDispatch, useSelector} from 'react-redux';
import {removePostDetail} from '../redux/reducers/FeedSlice';
import {refreshPostDetail, initPostDetail} from '../redux/actions/FeedActions';
import {getAuthStatus} from '../redux/reducers/AuthSlice';
import {
  isFeedRefreshing,
  isFeedLoading,
} from '../redux/selectors/FeedSelectors';
import {getPostisDeleted} from '../redux/selectors/PostSelectors';
import {makeId} from '../components/Post/helpers';
import {goBack} from '../navigation/Ref';
import {Button} from 'react-native-elements';

const PostDetail = ({route}) => {
  const dispatch = useDispatch();

  const postId = route?.params?.postId;
  const [screenId, setScreenId] = useState(undefined);

  const isPostDeleted = useSelector((state) => getPostisDeleted(state, postId));
  const refreshing = useSelector((state) => isFeedRefreshing(state, screenId));
  const loading = useSelector((state) => isFeedLoading(state, screenId));

  const authStatus = useSelector(getAuthStatus);

  useEffect(() => {
    const newScreenId = 'PostDetail-' + postId + '-' + makeId(5);
    setScreenId(newScreenId);

    return () => dispatch(removePostDetail(screenId));
  }, [postId]);

  useEffect(() => {
    if (authStatus != 'UNAUTHENTICATED' && screenId) {
      loadPostDetail();
    }
  }, [screenId, authStatus]);

  const loadPostDetail = async () => {
    dispatch(initPostDetail({screenId, postId}));

    isPostDeleted === undefined && handleRefresh();
  };

  const handleRefresh = () => {
    dispatch(refreshPostDetail({type: screenId, postId}));
  };

  console.log('running post detail -', screenId);

  const refreshingPostView = (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="#2a9df4" />
      <Text
        style={{padding: 50, fontSize: 15, fontWeight: 'bold', color: '#555'}}>
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
          borderColor: '#ddd',
          borderRadius: 10,
          backgroundColor: '#fff',
          width: '100%',
          flex: 1,
          marginBottom: 45,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <PostCard postId={postId} screen={'PostDetail'} screenId={screenId} />

        <CommentList postId={postId} key={postId} screenId={screenId} />
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
        backgroundColor: '#fafafa',
      }}>
      <Text style={{fontWeight: 'bold', fontSize: 20, color: '#555'}}>
        {'  '}
        Post not available{'  '}
      </Text>
      <Button
        title="Go Back"
        type="outline"
        raised
        titleStyle={{fontSize: 15, color: '#2a9df4', padding: 4}}
        onPress={() => goBack()}
      />
    </View>
  );
  return loading || refreshing || authStatus == 'UNAUTHENTICATED'
    ? refreshingPostView
    : isPostDeleted == false
    ? postView
    : postNotAvailableView;
};

export default memo(PostDetail);
