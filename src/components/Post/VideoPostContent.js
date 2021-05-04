import React, {memo, useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import MediaLoadError from './MediaLoadError';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsPostInFeedPaused,
  getIsPostInFeedLoaded,
  getIsPostInFeedError,
  getIsPostInFeedIsViewable,
} from '../../redux/selectors/FeedSelectors';
import {
  togglePause,
  pauseVideo,
  setLoaded,
  setError,
  onVideoEnd,
} from '../../redux/reducers/FeedSlice';
import {getPostMediaMetadata} from '../../redux/selectors/PostSelectors';
import {
  scaleHeightAndWidthAccordingToDimensions,
  mediaUrlWithWidth,
} from './helpers';

const VideoPostContent = (props) => {
  const dispatch = useDispatch();
  const [reloadCount, setReloadCount] = useState(0); // move to redux
  const [reloading, setReloading] = useState(false);

  const {
    ogImageUrl,
    postId,
    screen,
    screenId,
    type,
    ogVideoUrl,
    ogHeight,
    ogWidth,
  } = props;

  const mediaMetadata =
    type != 'link' &&
    useSelector((state) => getPostMediaMetadata(state, postId));

  const {height, width} =
    type == 'link'
      ? {height: ogHeight, width: ogWidth}
      : scaleHeightAndWidthAccordingToDimensions(
          mediaMetadata,
          'video',
          screen,
        );

  const videoUrl = type == 'link' ? ogVideoUrl : mediaMetadata.secure_url;

  const posterUrl = ogImageUrl
    ? ogImageUrl
    : videoUrl.substring(0, videoUrl.lastIndexOf('.')) + '.jpg';

  const currentScreen = screenId ? screenId : screen;

  const loaded = useSelector((state) =>
    getIsPostInFeedLoaded(state, currentScreen, postId),
  );
  const paused = useSelector((state) =>
    getIsPostInFeedPaused(state, currentScreen, postId),
  );
  const error = useSelector((state) =>
    getIsPostInFeedError(state, currentScreen, postId),
  );

  const isViewable = useSelector((state) =>
    getIsPostInFeedIsViewable(state, currentScreen, postId),
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused && !paused) {
      dispatch(pauseVideo({postId: postId, type: currentScreen}));
    }
  }, [isFocused]);

  const togglePlay = () => {
    dispatch(togglePause({postId: postId, type: currentScreen}));
  };

  const reloadVideo = () => {
    console.log('reloading video');
    setReloading(true);

    setTimeout(() => {
      console.log('setting reload false');
      setReloadCount(reloadCount + 1);
      setReloading(false);
    }, 1000);
  };

  const onError = (error) => {
    if (reloadCount < 5 && Platform.OS == 'ios' && type != 'link') {
      console.log(
        'error loading video in ios, so reloading',
        error,
        videoUrl,
        reloadCount,
      );
      reloadVideo();
    } else {
      console.log('error loading video', error, videoUrl, reloadCount);
      dispatch(setError({postId: postId, type: currentScreen}));
    }
  };

  const onLoad = () =>
    dispatch(setLoaded({postId: postId, type: currentScreen}));

  const VideoComponent =
    loaded || error || isViewable ? (
      !reloading ? (
        <Video
          key={reloadCount}
          style={{
            width: width,
            height: height,
          }}
          source={{uri: videoUrl}}
          resizeMode="contain"
          paused={paused}
          onLoad={onLoad}
          onError={onError}
          poster={posterUrl}
          showPoster={true}
          posterResizeMode={'contain'}
          playWhenInactive={false}
          muted={false}
          repeat={false}
          onEnd={() =>
            dispatch(onVideoEnd({postId: postId, type: currentScreen}))
          }
          controls={Platform.OS == 'ios' ? true : false}
        />
      ) : null
    ) : null;

  const videoLoadingIndicator = !loaded && !error && (
    <View
      style={{
        position: 'absolute',
      }}>
      <Image
        source={require('../../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
    </View>
  );

  const playerControls = loaded && (
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
          <Icon name="play" type="font-awesome-5" size={40} color="#fff" />
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
        {!error && VideoComponent}
        {videoLoadingIndicator}
        {error && <MediaLoadError type="Video" />}
        {playerControls}
      </ImageBackground>
    </View>
  );
};

export default memo(VideoPostContent);
