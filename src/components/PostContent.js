import React from 'react';
import {View, Text, TouchableHighlight, Image} from 'react-native';
import Video from 'react-native-video';

export default function PostContent(props) {
  const PostContentWrapper = (props) => {
    return (
      <View
        style={{
          paddingVertical: 15,
          borderLeftWidth: 1,
          borderColor: '#eee',
          width: '99%',
          alignSelf: 'center',
          padding: 3,
        }}>
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="#fff"
          onPress={() =>
            props.navigation.navigate('PostDetail', {
              post: props.item,
            })
          }>
          {props.children}
        </TouchableHighlight>
      </View>
    );
  };
  const TextPost = (
    <Text
      style={{
        color: '#444',
        fontSize: 14,
        fontWeight: '400',
      }}>
      {props.item.description}
    </Text>
  );

  const ImagePost = (
    <Image
      style={{
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
      }}
      source={{
        uri: props.item.link,
      }}
    />
  );

  const VideoPost = (
    <Video
      style={{
        width: '100%',
        aspectRatio: 1,
      }}
      source={{uri: props.item.link}}
      resizeMode="contain"
      paused={false}
      showPoster={true}
      playWhenInactive={false}
      muted={true}
      repeat={true}
    />
  );

  const GifPost = (
    <Image
      style={{
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
      }}
      source={{
        uri: props.item.link,
      }}
    />
  );

  const LinkPost = (
    <Image
      style={{
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
      }}
      source={{
        uri: props.item.link,
      }}
    />
  );

  const DefaultPost = <Text>{JSON.stringify(props.item)}</Text>;

  const PostType = () => {
    switch (props.item.type) {
      case 'text':
        return TextPost;
      case 'image':
        return ImagePost;
      case 'video':
        return VideoPost;
      case 'gif':
        return GifPost;
      case 'link':
        return LinkPost;
      default:
        return DefaultPost;
    }
  };

  return (
    <PostContentWrapper navigation={props.navigation} item={props.item}>
      <PostType />
    </PostContentWrapper>
  );
}
