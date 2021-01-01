import React, {useEffect, useState} from 'react';
import {ScrollView, View, ActivityIndicator} from 'react-native';
import CommentList from '../redux/connectors/CommentList';
import Post from '../components/Post';
import FloatingAddComment from '../redux/connectors/FloatingAddComment';

export default function PostDetail(props) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post != null) {
      setLoading(false);
    }
  }, [post]);

  useEffect(() => {
    setPost(props.feed[props.feedMap.get(props.route.params.post._id)]);
  }, [
    props.feed[props.feedMap.get(props.route.params.post._id)].commentCount,
    props.feed[props.feedMap.get(props.route.params.post._id)].voteCount,
  ]);

  useEffect(() => {
    setPost(props.feed[props.feedMap.get(props.route.params.post._id)]);
  }, []);

  return loading ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        opacity: 0.9,
      }}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  ) : (
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
        <Post item={post} />
        <CommentList navigation={props.navigation} item={post} />
      </ScrollView>
      <FloatingAddComment item={post} />
    </View>
  );
}
