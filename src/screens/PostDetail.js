import React from 'react';
import {ScrollView, View} from 'react-native';
import CommentList from '../components/CommentList';
import Post from '../components/Post';
import CommentWriter from '../components/CommentWriter';
import {useSelector} from 'react-redux';
import {selectPostById} from '../redux/reducers/PostSlice';

export default function PostDetail({route, navigation}) {
  const post = useSelector((state) => selectPostById(state, route.params.post));
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
        <Post item={post._id} caller={'PostDetail'} />
        <CommentList navigation={navigation} item={post._id} key={post._id} />
      </ScrollView>
      <CommentWriter postId={post._id} />
    </View>
  );
}
