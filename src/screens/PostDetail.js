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

export default function PostDetail({route, navigation}) {
  const postId = route.params.postId;
  const flatPost = useSelector(selectFlatPostById(postId));
  let post = flatPost ? flatPost : {};

  const {
    _id,
    created_at,
    title,
    type,
    description,
    link,
    mediaMetadata,
    ogData,
    userVote,
    voteCount,
    commentCount,
    communityDetail,
    authorDetail,
  } = post;

  const {_id: communityId, name: communityName} = flatPost
    ? communityDetail
    : {};
  const {_id: authorId, displayname: authorDisplayname} = flatPost
    ? authorDetail
    : {};

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
            communityName={communityName}
            communityId={communityId}
            authorDisplayname={authorDisplayname}
            authorId={authorId}
            created_at={created_at}
            title={title}
            type={type}
            description={description}
            mediaMetadata={mediaMetadata}
            height={height}
            width={width}
            ogData={ogData}
            link={link}
            userVote={userVote}
            voteCount={voteCount}
            commentCount={commentCount}
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
        <CommentList navigation={navigation} postId={postId} key={postId} />
      </ScrollView>
      <CommentWriter postId={postId} />
    </View>
  );
}
