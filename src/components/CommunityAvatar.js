import React from 'react';
import {Avatar} from 'react-native-elements';
import {getColorFromTitle} from './helpers';
import {push} from '../navigation/Ref';

const CommunityAvatar = (props) => {
  const {communityName, communityId, size} = props;

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 15;
      case 'large':
        return 30;

      default:
        return 15;
    }
  };
  return (
    <Avatar
      rounded
      title={communityName.substring(0, 2)}
      titleStyle={{
        textTransform: 'uppercase',
        fontSize: getFontSize(),
      }}
      size={size}
      onPress={() =>
        push('CommunityDetail', {
          communityId: communityId,
        })
      }
      containerStyle={{backgroundColor: getColorFromTitle(communityName)}}
    />
  );
};
export default CommunityAvatar;
