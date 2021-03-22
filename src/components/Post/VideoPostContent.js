import React, {memo, useEffect} from 'react';
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
  getIsPausedSelector,
  getIsLoadedSelector,
  getIsErrorSelector,
} from '../../redux/selectors/FeedSelectors';
import {
  togglePause,
  pauseVideo,
  setLoaded,
  setError,
} from '../../redux/reducers/FeedSlice';

const VideoPostContent = (props) => {
  const dispatch = useDispatch();
  const {videoUrl, imageUrl, height, width, postId, screen, screenId} = props;

  const currentScreen = screenId ? screenId : screen;

  const getIsLoading = getIsLoadedSelector();
  const getIsPaused = getIsPausedSelector();
  const getIsError = getIsErrorSelector();

  const loaded = useSelector(getIsLoading(currentScreen, postId));
  const paused = useSelector(getIsPaused(currentScreen, postId));
  const error = useSelector(getIsError(currentScreen, postId));

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused && !paused) {
      dispatch(pauseVideo({postId: postId, type: currentScreen}));
    }
  }, [isFocused]);

  const posterUrl = imageUrl
    ? imageUrl
    : videoUrl.substring(0, videoUrl.lastIndexOf('.')) + '.jpg';

  const togglePlay = () => {
    dispatch(togglePause({postId: postId, type: currentScreen}));
  };

  const onError = () => {
    console.log('error loading video');
    dispatch(setError({postId: postId, type: currentScreen}));
  };

  const onLoad = () =>
    dispatch(setLoaded({postId: postId, type: currentScreen}));

  const VideoComponent = (
    <Video
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
      repeat={true}
      controls={Platform.OS == 'ios' ? true : false}
    />
  );

  const videoLoadingIndicator = !loaded && !error && (
    <View
      style={{
        position: 'absolute',
      }}>
      {
        /*<ActivityIndicator
          size="large"
          color="#4285f4"
          animating={!loaded && !error}
        />*/
        // Not showing activity indicator here becuase it flickers scroll on android
        <Image
          source={require('../../../assets/loading.gif')}
          style={{height: 40, width: 40}}
        />
      }
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
        {!error && VideoComponent}
        {videoLoadingIndicator}
        {error && <MediaLoadError type="Video" />}
        {playerControls}
      </ImageBackground>
    </View>
  );
};

export default memo(VideoPostContent);
