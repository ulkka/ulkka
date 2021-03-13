import React, {memo} from 'react';
import {Image} from 'react-native';

const GifPostContent = (props) => {
  const {mediaMetadata, height, width} = props;
  return (
    <Image
      style={{
        width: '100%',
        aspectRatio: 1,
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
