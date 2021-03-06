import React, {memo} from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {useSelector} from 'react-redux';
import {navigate} from '../../navigation/Ref';
import {getPostField} from '../../redux/reducers/PostSlice';
import LinkPostContent from './LinkPostContent';
import TextPostContent from './TextPostContent';
import ImagePostContent from './ImagePostContent';
import VideoPostContent from './VideoPostContent';
import GifPostContent from './GifPostContent';

function PostContent(props) {
  const postId = props.postId;
  const caller = props.caller;
  const postType = useSelector(getPostField(postId, 'type'));

  const ContentType =
    postType == 'image' || postType == 'video' || postType == 'gif'
      ? 'media'
      : 'textual';

  const DefaultPost = <Text>{JSON.stringify(postId)}</Text>;

  function navigateToPostDetail() {
    if (caller != 'PostDetail') {
      navigate('PostDetail', {
        postId: postId,
      });
    }
  }

  const PostContentWrapper = (props) => {
    return (
      <View
        style={{
          paddingVertical: ContentType == 'media' ? 0 : 15,
          paddingTop: ContentType == 'media' ? 5 : 0,
          borderLeftWidth: ContentType == 'media' ? 0 : 1,
          borderColor: '#eee',
          width: ContentType == 'media' ? '100%' : '97%',
          alignSelf: 'center',
          padding: ContentType == 'media' ? 0 : 3,
        }}>
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="#fff"
          onPress={() => navigateToPostDetail()}>
          {props.children}
        </TouchableHighlight>
      </View>
    );
  };

  const PostType = () => {
    switch (postType) {
      case 'text':
        return <TextPostContent postId={postId} />;
      case 'image':
        return <ImagePostContent postId={postId} />;
      case 'video':
        return <VideoPostContent postId={postId} />;
      case 'gif':
        return <GifPostContent postId={postId} />;
      case 'link':
        return <LinkPostContent postId={postId} />;
      default:
        return DefaultPost;
    }
  };

  return (
    <PostContentWrapper>
      <PostType />
    </PostContentWrapper>
  );
}

export default memo(PostContent);
