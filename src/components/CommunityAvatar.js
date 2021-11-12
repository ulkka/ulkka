import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Avatar, useTheme} from 'react-native-elements';
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
import {getUriImage} from './helpers';

const CommunityAvatar = props => {
  const {theme} = useTheme();
  const {communityId, size, disableTouch, name, icon} = props;
  const communityName = useSelector(state =>
    getCommunityTitle(state, communityId),
  );

  const shrunkCommunityName = communityName
    ? communityName?.replace('#', '').substring(0, 2)
    : name
    ? name?.replace('#', '').substring(0, 2)
    : 'UL';

  const communityIcon = useSelector(state =>
    getCommunityIcon(state, communityId),
  );
  const finalCommunityIcon = communityIcon
    ? communityIcon
    : icon
    ? icon
    : undefined;

  const userRole = useSelector(state =>
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
        return 48;
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
        return theme.colors.blue;
      case 'admin':
        return theme.colors.green;
      default:
        return '#454545';
    }
  };
  return finalCommunityIcon?.length ? (
    <TouchableOpacity
      disabled={size == 'large' || disableTouch}
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
          uri: getUriImage(
            mediaUrlWithWidth(finalCommunityIcon, 100, 'avatar'),
          ),
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      disabled={size == 'large' || disableTouch}
      onPress={() =>
        push('CommunityNavigation', {
          communityId: communityId,
        })
      }>
      <Avatar
        rounded
        title={shrunkCommunityName}
        titleStyle={{
          textTransform: 'uppercase',
          fontSize: getFontSize(),
        }}
        size={size}
        containerStyle={{
          backgroundColor: getColorFromTitle(communityName),
          borderWidth: 2,
          borderColor: getBorderColor(),
        }}
      />
    </TouchableOpacity>
  );
};
export default CommunityAvatar;
