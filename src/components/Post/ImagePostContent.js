import React, {memo} from 'react';
import {View, Image} from 'react-native';
import FastImage from 'react-native-fast-image'; // delete extra lines from android/app/proguard-rules.pro if uninstalling
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsLoadedSelector,
  getIsErrorSelector,
} from '../../redux/selectors/FeedSelectors';
import {setLoaded, setError} from '../../redux/reducers/FeedSlice';
import MediaLoadError from './MediaLoadError';

const ImagePostContent = (props) => {
  const dispatch = useDispatch();
  const {imageUrl, height, width, screen, postId} = props;

  const getIsLoading = getIsLoadedSelector();
  const loaded = useSelector(getIsLoading(screen, postId));

  const getIsError = getIsErrorSelector();
  const error = useSelector(getIsError(screen, postId));

  const onError = () => {
    console.log('error loading image');
    dispatch(setError({postId: postId, type: screen}));
  };

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
        onLoad={() => dispatch(setLoaded({postId: postId, type: screen}))}
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
