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
import {Icon, useTheme} from 'react-native-elements';
import MediaLoadError from './MediaLoadError';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsPostInFeedPaused,
  getIsPostInFeedIsViewable,
} from '../../redux/selectors/FeedSelectors';
import {
  togglePause,
  pauseVideo,
  onVideoEnd,
} from '../../redux/reducers/FeedSlice';
import {
  getPostMediaMetadata,
  getPostMediaLocalUri,
  getPostMediaIsDownloading,
  getPostMediaIsDownloaded,
  getPostIsMediaError,
} from '../../redux/selectors/PostSelectors';
import {downloadMedia} from '../../redux/actions/PostActions';
import {
  scaleHeightAndWidthAccordingToDimensions,
  mediaUrlWithWidth,
} from './helpers';

const VideoPostContent = props => {
  const {theme} = useTheme();

  const dispatch = useDispatch();
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
    type != 'link' && useSelector(state => getPostMediaMetadata(state, postId));

  const isDownloading = useSelector(state =>
    getPostMediaIsDownloading(state, postId),
  );
  const localUri = useSelector(state => getPostMediaLocalUri(state, postId));
  const downloaded = useSelector(state =>
    getPostMediaIsDownloaded(state, postId),
  );

  const isMediaError = useSelector(state => getPostIsMediaError(state, postId));

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

  const paused = useSelector(state =>
    getIsPostInFeedPaused(state, currentScreen, postId),
  );

  const isViewable = useSelector(state =>
    getIsPostInFeedIsViewable(state, currentScreen, postId),
  );
  useEffect(() => {
    downloadMediaHandler();
  }, []);

  const downloadMediaHandler = () => {
    if (!isDownloading && !downloaded) {
      dispatch(downloadMedia(postId));
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused && !paused) {
      dispatch(pauseVideo({postId: postId, type: currentScreen}));
    }
  }, [isFocused]);

  const togglePlay = () => {
    dispatch(togglePause({postId: postId, type: currentScreen}));
  };

  const VideoComponent = (downloaded || isViewable) && (
    <Video
      key={postId}
      style={{
        width: width,
        height: height,
      }}
      source={{uri: 'file://' + localUri}}
      resizeMode="contain"
      paused={paused}
      poster={posterUrl}
      showPoster={true}
      posterResizeMode={'contain'}
      playWhenInactive={false}
      muted={false}
      repeat={false}
      onEnd={() => dispatch(onVideoEnd({postId: postId, type: currentScreen}))}
      controls={Platform.OS == 'ios' ? true : false}
    />
  );

  const videoLoadingIndicator = !downloaded && !isMediaError && (
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

  const playerControls = downloaded && (
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
          <Icon name="play" type="font-awesome-5" size={40} color={'#fbfbfb'} />
        )}
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: theme.colors.black0,
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
        {!isMediaError && VideoComponent}
        {videoLoadingIndicator}
        {isMediaError && <MediaLoadError type="Video" postId={postId} />}
        {playerControls}
      </ImageBackground>
    </View>
  );
};

export default memo(VideoPostContent);
