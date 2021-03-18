import React, {memo} from 'react';
import {Image} from 'react-native';

const GifPostContent = (props) => {
  const {mediaMetadata, height, width} = props;
  return (
    <Image
      style={{
        width: width,
        height: height,
        resizeMode: 'contain',
        alignSelf: 'center',
      }}
      source={{
        uri: mediaMetadata.secure_url,
      }}
    />
  );
};

export default memo(GifPostContent);
