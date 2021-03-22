import React, {memo} from 'react';
import {View, Image} from 'react-native';
import FastImage from 'react-native-fast-image'; // delete extra lines from android/app/proguard-rules.pro if uninstalling
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsPostInFeedLoaded,
  getIsPostInFeedError,
} from '../../redux/selectors/FeedSelectors';
import {setLoaded, setError} from '../../redux/reducers/FeedSlice';
import MediaLoadError from './MediaLoadError';
import {getPostMediaMetadata} from '../../redux/selectors/PostSelectors';
import {scaleHeightAndWidthAccordingToDimensions} from './helpers';

const ImagePostContent = (props) => {
  const dispatch = useDispatch();
  const {screen, postId, screenId, ogImageUrl, type, ogHeight, ogWidth} = props;

  const mediaMetadata =
    type != 'link' &&
    useSelector((state) => getPostMediaMetadata(state, postId));

  const imageUrl = type == 'link' ? ogImageUrl : mediaMetadata.secure_url;

  const {height, width} =
    type == 'link'
      ? {height: ogHeight, width: ogWidth}
      : scaleHeightAndWidthAccordingToDimensions(
          mediaMetadata,
          'image',
          screen,
        );

  const currentScreen = screenId ? screenId : screen;

  const loaded = useSelector((state) =>
    getIsPostInFeedLoaded(state, currentScreen, postId),
  );

  const error = useSelector((state) =>
    getIsPostInFeedError(state, currentScreen, postId),
  );

  const onError = () => {
    console.log('error loading image');
    dispatch(setError({postId: postId, type: currentScreen}));
  };
  const onLoad = () =>
    dispatch(setLoaded({postId: postId, type: currentScreen}));

  const loadingIndicator = !loaded && !error && (
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

  return (
    <View
      style={{
        alignSelf: 'center',
        height: height,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FastImage
        style={{
          height: height,
          width: width,
          alignSelf: 'center',
        }}
        onLoad={onLoad}
        source={{
          uri: imageUrl,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.contain}
        onError={onError}
      />
      {loadingIndicator}
      {error && <MediaLoadError type="Image" />}
    </View>
  );
};

export default memo(ImagePostContent);
