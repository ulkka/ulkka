import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {selectPostById} from '../redux/reducers/PostReducer';

export default function PostContent(props) {
  const post = useSelector((state) => selectPostById(state, props.item));

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
      {post.description}
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
        uri: post.link,
      }}
    />
  );

  const VideoPost = (
    <Video
      style={{
        width: '100%',
        aspectRatio: 1,
      }}
      source={{uri: post.link}}
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
        uri: post.link,
      }}
    />
  );

  const LinkPost = () => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderColor: '#ccc',
          justifyContent: 'center',
          borderWidth: 1,
          borderRadius: 5,
        }}>
        <TouchableOpacity
          onPress={() => console.log('click link')}
          style={{
            padding: 5,
            alignItems: 'flex-start',
            backgroundColor: '#333',
          }}>
          <Image
            source={{
              uri: post.ogData.ogImage.url,
            }}
            style={{
              width: '100%',
              aspectRatio: 1,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            padding: 5,
          }}>
          <View style={{margin: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 13, color: '#333'}}>
              {post.ogData.ogTitle}
            </Text>
          </View>
          <View style={{marginHorizontal: 5}}>
            <Text style={{fontSize: 11, color: '#444'}}>
              {post.ogData.ogDescription}
            </Text>
          </View>
          <View style={{marginVertical: 10, marginHorizontal: 5}}>
            <Text style={{fontSize: 9, color: '#555'}}>
              {post.ogData.ogUrl}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const DefaultPost = <Text>{JSON.stringify(props.item)}</Text>;

  const PostType = () => {
    switch (post.type) {
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
