import React, {memo} from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {navigate} from '../../navigation/Ref';
import LinkPostContent from './LinkPostContent';
import TextPostContent from './TextPostContent';
import ImagePostContent from './ImagePostContent';
import VideoPostContent from './VideoPostContent';
import GifPostContent from './GifPostContent';

function PostContent(props) {
  const {postId, caller, type, description, mediaMetadata, ogData} = props;

  const ContentType =
    type == 'image' || type == 'video' || type == 'gif' ? 'media' : 'textual';

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
    switch (type) {
      case 'text':
        return <TextPostContent description={description} />;
      case 'image':
        return <ImagePostContent mediaMetadata={mediaMetadata} />;
      case 'video':
        return <VideoPostContent mediaMetadata={mediaMetadata} />;
      case 'gif':
        return <GifPostContent mediaMetadata={mediaMetadata} />;
      case 'link':
        return <LinkPostContent ogData={ogData} />;
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
