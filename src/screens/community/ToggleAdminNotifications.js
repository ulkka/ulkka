import React, {memo, useContext} from 'react';
import {Switch} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsUserSubscribedToAdminNotifications,
  toggleAdminNotifications,
} from '../../redux/reducers/CommunitySlice';

export default memo(function ToggleAdminNotifications({route}) {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();

  const {communityId} = route.params;
  const isEnabled = useSelector(state =>
    getIsUserSubscribedToAdminNotifications(state, communityId),
  );

  const toggleSwitch = () => {
    dispatch(toggleAdminNotifications(communityId));
  };
  return (
    <Switch
      trackColor={{false: theme.colors.black7, true: theme.colors.blue}}
      thumbColor={isEnabled ? theme.colors.grey2 : theme.colors.grey1}
      ios_backgroundColor={theme.colors.black4}
      onValueChange={toggleSwitch}
      value={isEnabled}
    />
  );
});
