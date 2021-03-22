import React, {useEffect} from 'react';
import {ScrollView, View, RefreshControl} from 'react-native';
import CommentList from '../components/Comment/CommentList';
import Post from '../components/Post/Post';
import CommentWriter from '../components/Comment/CommentWriter';
import {useDispatch} from 'react-redux';
import {
  initialisePostDetail,
  populatePostDetail,
  removePostDetail,
} from '../redux/reducers/FeedSlice';
import {makeId} from '../components/Post/helpers';

export default function PostDetail({route}) {
  const dispatch = useDispatch();

  const postId = route.params.postId;

  const screenId = 'PostDetail-' + postId + '-' + makeId(5);

  dispatch(initialisePostDetail(screenId));
  dispatch(populatePostDetail({screenId, postId}));

  useEffect(() => {
    return () => dispatch(removePostDetail(screenId));
  }, []);

  console.log('running post detail -', screenId);

  return (
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
          <RefreshControl
            refreshing={false}
            onRefresh={() => console.log('refreshing post detail')}
          />
        }>
        <Post postId={postId} screen={'PostDetail'} screenId={screenId} />
        <CommentList postId={postId} key={postId} />
      </ScrollView>
      <CommentWriter postId={postId} />
    </View>
  );
}
