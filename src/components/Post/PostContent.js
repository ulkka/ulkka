import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {navigate} from '../../navigation/Ref';
import LinkPostContent from './LinkPostContent';
import TextPostContent from './TextPostContent';
import ImagePostContent from './ImagePostContent';
import VideoPostContent from './VideoPostContent';
import GifPostContent from './GifPostContent';

function PostContent(props) {
  const {
    postId,
    screen,
    type,
    description,
    mediaMetadata,
    height,
    width,
    ogData,
    link,
  } = props;

  const ContentType =
    type == 'image' || type == 'video' || type == 'gif' ? 'media' : 'textual';

  const DefaultPost = <Text>{JSON.stringify(postId)}</Text>;

  function navigateToPostDetail() {
    navigate('PostDetail', {
      postId: postId,
    });
  }

  const PostContentWrapper = (props) => {
    return (
      <View
        style={{
          paddingBottom: type == 'text' ? 10 : 0,
          width: '100%',
          paddingHorizontal: ContentType == 'media' ? 0 : 4,
          backgroundColor: type == 'video' ? '#111' : '#fff',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={
            screen == 'PostDetail' || type == 'video' || type == 'link'
              ? true
              : false
          }
          underlayColor="#fff"
          onPress={() =>
            type == 'video' || type == 'link'
              ? console.log('video/link type, so not navigating')
              : navigateToPostDetail()
          }>
          {props.children}
        </TouchableOpacity>
      </View>
    );
  };

  const PostType = () => {
    switch (type) {
      case 'text':
        return <TextPostContent description={description} />;
      case 'image':
      case 'gif':
        return (
          <ImagePostContent
            imageUrl={mediaMetadata.secure_url}
            height={height}
            width={width}
          />
        );
      case 'video':
        return (
          <VideoPostContent
            postId={postId}
            videoUrl={mediaMetadata.secure_url}
            link={link}
            height={height}
            width={width}
            screen={screen}
          />
        );
      case 'link':
        return (
          <LinkPostContent
            postId={postId}
            ogData={ogData}
            link={link}
            height={height}
            width={width}
            screen={screen}
          />
        );
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
