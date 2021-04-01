import React from 'react';
import FastImage from 'react-native-fast-image';
import {View} from 'react-native';
import {axiosConfig} from '../client/axiosConfig';

export default function UserAvatar(props) {
  const {seed, size} = props;
  const avatarUri = axiosConfig.baseUrl + 'utility/avatar/' + seed;

  function getDimensionFromSize(size) {
    switch (size) {
      case 'large':
        return 36;
      case 'medium':
        return 33;
      case 'small':
        return 20;
      default:
        return 33;
    }
  }

  const dimension = getDimensionFromSize(size);
  return (
    <FastImage
      style={{
        height: dimension,
        width: dimension,
        alignSelf: 'center',
      }}
      source={{
        uri: avatarUri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
}
