import React, {useEffect} from 'react';
import {ScrollView, View, RefreshControl, Text} from 'react-native';
import CommentList from '../components/Comment/CommentList';
import Post from '../components/Post/Post';
import CommentWriter from '../components/Comment/CommentWriter';
import {useDispatch, useSelector} from 'react-redux';
import {
  initialisePostDetail,
  populatePostDetail,
  removePostDetail,
} from '../redux/reducers/FeedSlice';
import {getPostStatus} from '../redux/selectors/PostSelectors';
import {makeId} from '../components/Post/helpers';
import {goBack} from '../navigation/Ref';
import {Button} from 'react-native-elements';

export default function PostDetail({route}) {
  const dispatch = useDispatch();

  const postId = route.params.postId;
  const screenId = 'PostDetail-' + postId + '-' + makeId(5);

  const postStatus = useSelector((state) => getPostStatus(state, postId));

  useEffect(() => {
    dispatch(initialisePostDetail(screenId));
    dispatch(populatePostDetail({screenId, postId}));
    return () => dispatch(removePostDetail(screenId));
  }, []);

  console.log('running post detail -', screenId);

  return postStatus == 'enabled' ? (
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
  ) : (
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
}
