import React, {memo} from 'react';
import {View, ActivityIndicator, Image} from 'react-native';
import FastImage from 'react-native-fast-image'; // delete extra lines from android/app/proguard-rules.pro if uninstalling
//import {Image} from 'react-native-elements';

const ImagePostContent = (props) => {
  const {mediaMetadata, height, width} = props;

  return (
    <View style={{alignSelf: 'center', height: height, width: width}}>
      <FastImage
        style={{
          height: height,
          width: width,
          //resizeMode: 'contain',
          alignSelf: 'center',
        }}
        source={{
          uri: mediaMetadata.secure_url,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

export default memo(ImagePostContent);
