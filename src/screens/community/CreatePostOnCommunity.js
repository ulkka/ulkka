import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {showCreatorOverlay} from '../../redux/reducers/CreatorOverlaySlice';

export default memo(function CreatePostOnCommunity(props) {
  const dispatch = useDispatch();
  const {communityId} = props;

  return (
    <TouchableOpacity onPress={() => dispatch(showCreatorOverlay(communityId))}>
      <Icon name="plus" type="font-awesome" size={18} color="#666" />
    </TouchableOpacity>
  );
});
