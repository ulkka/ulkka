import React, {memo, useState, useEffect} from 'react';
import {View, ImageBackground, TouchableOpacity, Platform} from 'react-native';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';
import VideoPlayerComponent from './VideoPlayerComponent';
import {useSelector} from 'react-redux';
import {getFeedPostField} from '../../redux/reducers/FeedSlice';

const VideoPostContent = (props) => {
  const {mediaMetadata, height, width, postId} = props;
  const [paused, setPaused] = useState(true);
  const [loading, setLoading] = useState(true);

  const isViewable = useSelector((state) =>
    getFeedPostField(state.feed.screens['home'], postId, 'isViewable'),
  );
  console.log('isViewabe of postId', isViewable, postId);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setPaused(true);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isViewable && !paused) {
      setPaused(true);
    }
  }, [isViewable]);

  const posterUrl =
    mediaMetadata.secure_url.substring(
      0,
      mediaMetadata.secure_url.lastIndexOf('.'),
    ) + '.jpg';

  const VideoComponent = (
    <Video
      style={{
        width: width,
        height: height,
      }}
      source={{uri: mediaMetadata.secure_url}}
      resizeMode="contain"
      paused={paused}
      onLoad={() => setLoading(false)}
      poster={posterUrl}
      showPoster={Platform.OS == 'ios' ? true : true}
      playWhenInactive={false}
      muted={true}
      repeat={true}
      controls={Platform.OS == 'ios' ? false : false}
    />
  );

  const PlayerControls = loading ? (
    <View
      style={{
        position: 'absolute',
      }}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  ) : (
    <TouchableOpacity
      hitSlop={{
        top: height / 4,
        bottom: height / 4,
        left: width / 2,
        right: width / 2,
      }}
      style={{position: 'absolute'}}
      onPress={() => setPaused(!paused)}>
      {paused && (
        <Icon name="play" type="font-awesome-5" size={50} color="#fff" />
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: 'black',
        height: height,
        width: width,
      }}>
      {Platform.OS == 'android' ? (
        <ImageBackground
          source={{uri: posterUrl}}
          style={{
            resizeMode: 'contain',
            height: height,
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {VideoComponent}
          {PlayerControls}
        </ImageBackground>
      ) : (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          {VideoComponent}
          {PlayerControls}
        </View>
      )}
    </View>
  );
};

export default memo(VideoPostContent);
