import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {selectPostById} from '../redux/reducers/PostSlice';
import {navigate} from '../navigation/Ref';

export default function PostContent(props) {
  const post = useSelector((state) => selectPostById(state, props.item));

  const height =
    post.type == 'image'
      ? Math.ceil(
          (post.mediaMetadata.height * Dimensions.get('window').width) /
            post.mediaMetadata.width,
        )
      : 0;

  const type =
    post.type == 'image' || post.type == 'video' || post.type == 'gif'
      ? 'media'
      : 'textual';

  const PostContentWrapper = (props) => {
    return (
      <View
        style={{
          paddingVertical: type == 'media' ? 0 : 15,
          paddingTop: type == 'media' ? 5 : 0,
          borderLeftWidth: type == 'media' ? 0 : 1,
          borderColor: '#eee',
          width: type == 'media' ? '100%' : '97%',
          alignSelf: 'center',
          padding: type == 'media' ? 0 : 3,
        }}>
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="#fff"
          onPress={() => {
            if (props.caller != 'PostDetail') {
              navigate('PostDetail', {
                post: props.item,
              });
            }
          }}>
          {props.children}
        </TouchableHighlight>
      </View>
    );
  };

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 4); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  const TextPost = (
    <View>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : 5}
        style={{
          color: '#444',
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 21,
        }}>
        {post.description}
      </Text>
      {lengthMore ? (
        <TouchableOpacity
          onPress={toggleNumberOfLines}
          style={{
            marginTop: 20,
          }}>
          <Text
            style={{
              lineHeight: 21,
              color: '#035aa6',
            }}>
            {textShown ? 'Read less...' : 'Read more...'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const ImagePost = (
    <View
      style={{
        height: height,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{
          height: height,
          width: '100%',
          resizeMode: 'contain',
          alignSelf: 'center',
          backgroundColor: 'rgba(241, 243, 280, 1)',
        }}
        source={{
          uri: post.link,
        }}
      />
    </View>
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
    <PostContentWrapper
      navigation={props.navigation}
      item={props.item}
      caller={props.caller}>
      <PostType />
    </PostContentWrapper>
  );
}
