import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from 'react-native';
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

  const LinkPost = () => {
    console.log('link post');
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderColor: '#ccc',
          // flexDirection: 'row',
          justifyContent: 'center',
          borderWidth: 1,
          borderRadius: 5,
        }}>
        <TouchableOpacity
          onPress={() => console.log('click link')}
          style={{
            flex: 5,
            padding: 5,
            alignItems: 'flex-start',
            backgroundColor: '#eee',
            //borderWidth: 1,
          }}>
          <Image
            source={{uri: props.item.ogData.ogImage.url}}
            style={{
              // borderWidth: 1,
              width: '99%',
              aspectRatio: 1,
              //maxWidth: 160,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 5,
          }}>
          <View style={{margin: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 13, color: '#333'}}>
              {props.item.ogData.ogTitle}
            </Text>
          </View>
          <View style={{marginHorizontal: 5}}>
            <Text style={{fontSize: 11, color: '#555'}}>
              {props.item.ogData.ogDescription}
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
        return <LinkPost />;
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
