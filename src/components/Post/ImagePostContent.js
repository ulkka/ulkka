import React, {memo, useState} from 'react';
import {View, ActivityIndicator, Image} from 'react-native';
import FastImage from 'react-native-fast-image'; // delete extra lines from android/app/proguard-rules.pro if uninstalling
//import {Image} from 'react-native-elements';

const ImagePostContent = (props) => {
  const {mediaMetadata, height, width} = props;

  const [loaded, setLoaded] = useState(false);

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
        onLoad={() => setLoaded(true)}
        source={{
          uri: mediaMetadata.secure_url,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.web,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      {!loaded ? (
        <View
          style={{
            position: 'absolute',
          }}>
          <ActivityIndicator size="large" color="#4285f4" />
        </View>
      ) : null}
    </View>
  );
};

export default memo(ImagePostContent);
