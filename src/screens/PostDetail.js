import React from 'react';
import {ScrollView, View} from 'react-native';
import CommentList from '../components/CommentList';
import Post from '../components/Post';
import FloatingAddComment from '../components/FloatingAddComment';

export default function PostDetail({route, navigation}) {
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
        <Post item={route.params.post} />
        <CommentList navigation={navigation} item={route.params.post} />
      </ScrollView>
      <FloatingAddComment />
    </View>
  );
}
