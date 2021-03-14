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
    caller,
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

  console.log('running post conetent');
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
          paddingBottom: ContentType == 'media' ? 0 : 10,
          width: ContentType == 'media' ? '100%' : '97%',
          paddingHorizontal: ContentType == 'media' ? 0 : 5,
          backgroundColor: type == 'video' ? '#111' : '#fff',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          underlayColor="#fff"
          onPress={() =>
            type == 'video'
              ? console.log('video type, so not navigating')
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
        return (
          <ImagePostContent
            mediaMetadata={mediaMetadata}
            height={height}
            width={width}
          />
        );
      case 'video':
        return (
          <VideoPostContent
            mediaMetadata={mediaMetadata}
            link={link}
            height={height}
            width={width}
          />
        );
      case 'gif':
        return (
          <GifPostContent
            mediaMetadata={mediaMetadata}
            height={height}
            width={width}
          />
        );
      case 'link':
        return (
          <LinkPostContent
            ogData={ogData}
            link={link}
            height={height}
            width={width}
          />
        );
      default:
        return DefaultPost;
    }
    r;
  };

  return (
    <PostContentWrapper>
      <PostType />
    </PostContentWrapper>
  );
}

export default memo(PostContent);
