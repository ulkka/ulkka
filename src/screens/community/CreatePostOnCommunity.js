import React, {memo} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {showCreatorOverlay} from '../../redux/reducers/CreatorOverlaySlice';

export default memo(function CreatePostOnCommunity(props) {
  const dispatch = useDispatch();
  const {communityId} = props;

  return (
    <TouchableOpacity onPress={() => dispatch(showCreatorOverlay(communityId))}>
      <Icon name="plus" type="font-awesome" size={14} color="#666" />
      <Text style={{fontSize: 11, color: '#555'}}>Post</Text>
    </TouchableOpacity>
  );
});
