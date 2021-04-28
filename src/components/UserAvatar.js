import React from 'react';
import FastImage from 'react-native-fast-image';
import {axiosConfig} from '../client/axiosConfig';
import {getIDToken} from '../redux/reducers/AuthSlice';
import {useSelector} from 'react-redux';

export default function UserAvatar(props) {
  const {seed, size} = props;
  const avatarUri = axiosConfig.baseUrl + 'utility/avatar/' + seed;
  const idToken = useSelector(getIDToken);

  function getDimensionFromSize(size) {
    switch (size) {
      case 'extralarge':
        return 55;
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
        headers: {
          Authorization: 'Bearer ' + idToken,
        },
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
}
