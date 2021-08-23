import React from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsCommunityFavorite,
  enablePostNotification,
  disablePostNotification,
  getUserRoleInCommunity,
  getDisablePostNotification,
} from '../../redux/reducers/CommunitySlice';

export default function FavoriteCommunity(props) {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const {communityId} = props;
  const isNotificationDisabled = useSelector(state =>
    getDisablePostNotification(state, communityId),
  );
  const role = useSelector(state => getUserRoleInCommunity(state, communityId));

  const togglePostNotification = () => {
    if (!!isNotificationDisabled) {
      dispatch(enablePostNotification(communityId));
    } else {
      dispatch(disablePostNotification(communityId));
    }
  };

  const favoriteButton = (
    <TouchableOpacity onPress={togglePostNotification}>
      <Icon
        raised
        name={isNotificationDisabled ? 'bell-slash' : 'bell-slash-o'}
        type="font-awesome"
        color={isNotificationDisabled ? 'red' : theme.colors.black6}
        size={15}
      />
    </TouchableOpacity>
  );
  return role == 'member' || role == 'admin' ? favoriteButton : <View />;
}
