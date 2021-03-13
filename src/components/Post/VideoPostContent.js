import React, {memo, useState, useEffect} from 'react';
import {View, Platform, ImageBackground} from 'react-native';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';

const VideoPostContent = (props) => {
  const {mediaMetadata, height, width} = props;
  const [paused, setPaused] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setPaused(true);
    }
  }, [isFocused]);

  const posterUrl =
    mediaMetadata.secure_url.substring(
      0,
      mediaMetadata.secure_url.lastIndexOf('.'),
    ) + '.jpg';

  return Platform.OS == 'ios' ? (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: 'black',
        height: height,
        width: width,
      }}>
      <Video
        style={{
          width: width,
          height: height,
        }}
        source={{uri: mediaMetadata.secure_url}}
        //source={{uri: 'https://www.youtube.com/embed/35npVaFGHMY'}}
        resizeMode="contain"
        paused={paused}
        poster={posterUrl}
        showPoster={true}
        playWhenInactive={false}
        muted={true}
        repeat={true}
        controls={Platform.OS == 'ios' ? true : false}
        playWhenInactive={false}
      />
    </View>
  ) : (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: 'black',
        height: height,
        width: width,
      }}>
      <ImageBackground
        source={{uri: posterUrl}}
        style={{
          resizeMode: 'contain',
          height: height,
          width: width,
        }}>
        <Video
          style={{
            height: height,
            width: width,
          }}
          source={{uri: mediaMetadata.secure_url}}
          resizeMode="contain"
          paused={paused}
          poster={posterUrl}
          showPoster={true}
          playWhenInactive={false}
          muted={true}
          repeat={true}
          controls={Platform.OS == 'ios' ? true : false}
          playWhenInactive={false}
        />
      </ImageBackground>
    </View>
  );
};

export default memo(VideoPostContent);
