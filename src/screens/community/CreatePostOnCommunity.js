import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  showCreatorOverlay,
  hideCreatorOverlay,
  getEnableOverlay,
  toggleCreatorOverlay,
  getCreatorCommunityId,
} from '../../redux/reducers/CreatorOverlaySlice';

export default function CreatePostOnCommunity(props) {
  const dispatch = useDispatch();
  const {communityId} = props;
  console.log('props in createpost on community', props);

  return (
    <TouchableOpacity onPress={() => dispatch(showCreatorOverlay(communityId))}>
      <Icon name="plus" type="font-awesome" size={18} color="#666" />
    </TouchableOpacity>
  );
}
