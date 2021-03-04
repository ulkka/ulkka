import React from 'react';
import {ScrollView, View} from 'react-native';
import CommentList from '../components/Comment/CommentList';
import Post from '../components/Post/Post';
import CommentWriter from '../components/Comment/CommentWriter';

export default function PostDetail({route, navigation}) {
  const postId = route.params.postId;

  console.log('running post detail');

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
        }}>
        <Post postId={postId} caller={'PostDetail'} />
        <CommentList navigation={navigation} postId={postId} key={postId} />
      </ScrollView>
      <CommentWriter postId={postId} />
    </View>
  );
}
