import React, {memo, useState, useEffect} from 'react';
import {View, ImageBackground, TouchableOpacity, Platform} from 'react-native';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getIsPausedSelector} from '../../redux/selectors/FeedSelectors';
import {togglePause, pauseVideo} from '../../redux/reducers/FeedSlice';

const VideoPostContent = (props) => {
  const dispatch = useDispatch();
  const {videoUrl, imageUrl, height, width, postId, screen} = props;

  const postDetailScreen = screen == 'PostDetail' ? true : false;

  const [loading, setLoading] = useState(true);
  const [postDetailPaused, setPostDetailPaused] = useState(true); // play/pause handler for post detail screens

  const getIsPaused = getIsPausedSelector();
  const paused = postDetailScreen
    ? postDetailPaused
    : useSelector((state) => getIsPaused(state, screen, postId));

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused && !postDetailScreen) {
      dispatch(pauseVideo({postId: postId, type: screen}));
    }
  }, [isFocused]);

  const posterUrl = imageUrl
    ? imageUrl
    : videoUrl.substring(0, videoUrl.lastIndexOf('.')) + '.jpg';

  const togglePlay = () => {
    if (postDetailScreen) {
      setPostDetailPaused(!postDetailPaused);
    } else {
      dispatch(togglePause({postId: postId, type: screen}));
    }
  };

  const VideoComponent = (
    <Video
      style={{
        width: width,
        height: height,
      }}
      source={{uri: videoUrl}}
      resizeMode="contain"
      paused={paused}
      onLoad={() => setLoading(false)}
      poster={posterUrl}
      showPoster={true}
      posterResizeMode={'contain'}
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
      onPress={togglePlay}>
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
