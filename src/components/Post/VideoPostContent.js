import React, {memo, useState, useEffect} from 'react';
import {View, ImageBackground, TouchableOpacity, Platform} from 'react-native';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {getFeedPostFieldSelector} from '../../redux/selectors/FeedSelectors';

const VideoPostContent = (props) => {
  const {mediaMetadata, height, width, postId, screen} = props;
  const [paused, setPaused] = useState(true);
  const [loading, setLoading] = useState(true);

  const getFeedPostField = getFeedPostFieldSelector();
  const isViewable =
    screen == 'PostDetail'
      ? true
      : useSelector((state) =>
          getFeedPostField(state.feed.screens[screen], postId, 'isViewable'),
        );
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
      showPoster={true}
      playWhenInactive={false}
      muted={false}
      repeat={true}
      controls={Platform.OS == 'ios' ? true : false}
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
      {paused &&
        Platform.OS != 'ios' && ( // dot show play button when on ios
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
    </View>
  );
};

export default memo(VideoPostContent);
