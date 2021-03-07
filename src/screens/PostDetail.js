import React from 'react';
import {ScrollView, View, RefreshControl} from 'react-native';
import CommentList from '../components/Comment/CommentList';
import Post from '../components/Post/Post';
import CommentWriter from '../components/Comment/CommentWriter';

export default function PostDetail({route, navigation}) {
  const postId = route.params.postId;

  return (
    <View style={{flex: 1}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => console.log('refreshing post detail')}
          />
        }
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
