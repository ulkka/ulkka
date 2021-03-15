import React from 'react';
import {
  ScrollView,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import CommentList from '../components/Comment/CommentList';
import Post from '../components/Post/Post';
import CommentWriter from '../components/Comment/CommentWriter';
import {useSelector} from 'react-redux';
import {selectFlatPostById} from '../redux/selectors/PostSelectors';
import {scaleHeightAndWidthAccordingToDimensions} from '../components/Post/helpers';

export default function PostDetail({route}) {
  const postId = route.params.postId;
  const flatPost = useSelector((state) => selectFlatPostById(state, postId));
  let post = flatPost ? flatPost : {};

  const {mediaMetadata} = post;

  let {height, width} = scaleHeightAndWidthAccordingToDimensions(mediaMetadata);

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
            caller={'PostDetail'}
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
