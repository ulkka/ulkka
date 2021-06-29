import React, {memo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image'; // delete extra lines from android/app/proguard-rules.pro if uninstalling
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsPostInFeedLoaded,
  getIsPostInFeedError,
} from '../../redux/selectors/FeedSelectors';
import {setLoaded, setError} from '../../redux/reducers/FeedSlice';
import MediaLoadError from './MediaLoadError';
import {getPostMediaMetadata} from '../../redux/selectors/PostSelectors';
import {
  scaleHeightAndWidthAccordingToDimensions,
  mediaUrlWithWidth,
} from './helpers';
import {navigate} from '../../navigation/Ref';

const ImagePostContent = (props) => {
  const dispatch = useDispatch();
  const {
    screen,
    postId,
    screenId,
    ogImageUrl,
    type,
    ogHeight,
    ogWidth,
    resizeMode,
    borderRadius,
  } = props;

  const mediaMetadata =
    type != 'link' &&
    useSelector((state) => getPostMediaMetadata(state, postId));

  const {height, width} =
    type == 'link'
      ? {height: ogHeight, width: ogWidth}
      : scaleHeightAndWidthAccordingToDimensions(
          mediaMetadata,
          'image',
          screen,
        );

  const imageUrl =
    type == 'link'
      ? ogImageUrl
      : mediaUrlWithWidth(mediaMetadata.secure_url, width);
  //: mediaMetadata.secure_url;

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
        <Image
          source={require('../../../assets/loading.gif')}
          style={{height: 40, width: 40}}
        />
      }
    </View>
  );
  return (
    <TouchableOpacity
      disabled={type === 'link'}
      onPress={() =>
        navigate('ImageZoomer', {
          height: height,
          width: width,
          imageUrl: imageUrl,
        })
      }
      style={{
        alignSelf: 'center',
        height: height ? height : '300',
        width: width ? width : '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius,
      }}>
      <FastImage
        style={{
          height: height ? height : '300',
          width: width ? width : '100%',
          alignSelf: 'center',
          borderRadius: borderRadius,
        }}
        onLoad={onLoad}
        source={{
          uri: imageUrl,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={resizeMode ? resizeMode : FastImage.resizeMode.contain}
        onError={onError}
      />

      {loadingIndicator}
      {error && <MediaLoadError type="Image" />}
    </TouchableOpacity>
  );
};

export default memo(ImagePostContent);
