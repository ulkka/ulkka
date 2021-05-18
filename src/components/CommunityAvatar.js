import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements';
import {getColorFromTitle} from './helpers';
import {push} from '../navigation/Ref';
import {
  getCommunityTitle,
  getCommunityIcon,
  getUserRoleInCommunity,
} from '../redux/reducers/CommunitySlice';
import {useSelector} from 'react-redux';
import {mediaUrlWithWidth} from '../components/Post/helpers';
import FastImage from 'react-native-fast-image';

const CommunityAvatar = (props) => {
  const {communityId, size} = props;
  const communityName = useSelector((state) =>
    getCommunityTitle(state, communityId),
  );
  const communityIcon = useSelector((state) =>
    getCommunityIcon(state, communityId),
  );
  const userRole = useSelector((state) =>
    getUserRoleInCommunity(state, communityId),
  );

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 15;
      case 'medium':
        return 22;
      case 'large':
        return 30;

      default:
        return 15;
    }
  };
  const getImageSize = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'medium':
        return 55;
      case 'large':
        return 75;

      default:
        return 15;
    }
  };

  const getBorderWidth = () => {
    switch (size) {
      case 'small':
        return 2;
      case 'large':
        return 3;
      default:
        return 2;
    }
  };

  const getBorderColor = () => {
    switch (userRole) {
      case 'member':
        return '#2a9df4';
      case 'admin':
        return '#02862acc';
      default:
        return '#444';
    }
  };

  return communityIcon?.length ? (
    <TouchableOpacity
      disabled={size == 'large'}
      style={{
        height: getImageSize() + getBorderWidth(),
        width: getImageSize() + getBorderWidth(),
        alignSelf: 'center',
        borderRadius: 50,
        borderWidth: getBorderWidth(),
        borderColor: getBorderColor(),
        overflow: 'hidden',
      }}
      onPress={() => push('CommunityNavigation', {communityId: communityId})}>
      <FastImage
        rounded
        style={{
          height: getImageSize(),
          width: getImageSize(),
          borderRadius: 50,
          alignSelf: 'center',
          overflow: 'hidden',
        }}
        source={{
          uri: mediaUrlWithWidth(communityIcon, 100, 'avatar'),
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  ) : (
    <Avatar
      rounded
      title={communityName ? communityName.substring(0, 2) : 'UL'}
      titleStyle={{
        textTransform: 'uppercase',
        fontSize: getFontSize(),
      }}
      size={size}
      onPress={() =>
        size != 'large' &&
        push('CommunityNavigation', {
          communityId: communityId,
        })
      }
      containerStyle={{
        backgroundColor: getColorFromTitle(communityName),
        borderWidth: 2,
        borderColor: getBorderColor(),
      }}
    />
  );
};
export default CommunityAvatar;
