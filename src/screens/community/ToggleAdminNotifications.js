import React, {memo} from 'react';
import {Switch} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsUserSubscribedToAdminNotifications,
  toggleAdminNotifications,
} from '../../redux/reducers/CommunitySlice';

export default memo(function ToggleAdminNotifications({route}) {
  const dispatch = useDispatch();

  const {communityId} = route.params;
  const isEnabled = useSelector((state) =>
    getIsUserSubscribedToAdminNotifications(state, communityId),
  );

  const toggleSwitch = () => {
    dispatch(toggleAdminNotifications(communityId));
  };
  return (
    <Switch
      trackColor={{false: '#767577', true: '#289df4'}}
      thumbColor={isEnabled ? '#eee' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
});
