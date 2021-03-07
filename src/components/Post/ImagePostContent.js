import React, {memo} from 'react';
import {View, Image, Dimensions} from 'react-native';

const ImagePostContent = (props) => {
  const {mediaMetadata} = props;

  const height = Math.ceil(
    (mediaMetadata.height * Dimensions.get('window').width) /
      mediaMetadata.width,
  );

  return (
    <View
      style={{
        height: height,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{
          height: height,
          width: '100%',
          resizeMode: 'contain',
          alignSelf: 'center',
          backgroundColor: 'rgba(241, 243, 280, 1)',
        }}
        source={{
          uri: mediaMetadata.secure_url,
        }}
      />
    </View>
  );
};

export default memo(ImagePostContent);
