import React, {memo, useContext} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Icon, ThemeContext} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {showCreatorOverlay} from '../../redux/reducers/CreatorOverlaySlice';

export default memo(function CreatePostOnCommunity(props) {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();
  const {communityId} = props;

  return (
    <TouchableOpacity onPress={() => dispatch(showCreatorOverlay(communityId))}>
      <Icon
        name="plus"
        type="font-awesome"
        size={14}
        color={theme.colors.black6}
      />
      <Text style={{fontSize: 11, color: theme.colors.black5}}>Post</Text>
    </TouchableOpacity>
  );
});
