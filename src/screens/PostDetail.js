import React, {useEffect} from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import CommentList from '../components/Comment/CommentList';
import Post from '../components/Post/Post';
import CommentWriter from '../components/Comment/CommentWriter';
import {useSelector, useDispatch} from 'react-redux';
import {getFlatPostByIdSelector} from '../redux/selectors/PostSelectors';
import {scaleHeightAndWidthAccordingToDimensions} from '../components/Post/helpers';
import {
  initialisePostDetail,
  removeFromPostDetail,
} from '../redux/reducers/FeedSlice';

export default function PostDetail({route}) {
  const dispatch = useDispatch();

  const postId = route.params.postId;

  dispatch(initialisePostDetail(postId));

  useEffect(() => {
    return () => dispatch(removeFromPostDetail(postId));
  }, []);

  const selectFlatPostById = getFlatPostByIdSelector(); // do get post detail if post doesnt exist in post slice, for eg, while opening this screen directly through a link
  const flatPost = useSelector((state) => selectFlatPostById(state, postId));

  let post = flatPost ? flatPost : {};

  const {mediaMetadata, type, ogData} = post;

  let {height, width} =
    type == 'link'
      ? scaleHeightAndWidthAccordingToDimensions(ogData, 'og')
      : scaleHeightAndWidthAccordingToDimensions(mediaMetadata, 'media');

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
        {flatPost ? (
          <Post
            postId={postId}
            screen={'PostDetail'}
            height={height}
            width={width}
            {...post}
          />
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 300,
            }}>
            <ActivityIndicator size="large" color="#4285f4" />
          </View>
        )}
        <CommentList postId={postId} key={postId} />
      </ScrollView>
      <CommentWriter postId={postId} />
    </View>
  );
}
