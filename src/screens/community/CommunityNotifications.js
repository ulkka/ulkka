import React, {useContext} from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {Icon, ThemeContext} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsCommunityFavorite,
  favoriteCommunity,
  unfavoriteCommunity,
  getUserRoleInCommunity,
} from '../../redux/reducers/CommunitySlice';

export default function FavoriteCommunity(props) {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();
  const {communityId} = props;
  const isNotificationDisabled = useSelector(state =>
    getIsCommunityFavorite(state, communityId),
  );
  const role = useSelector(state => getUserRoleInCommunity(state, communityId));

  const favoriteButton = (
    <TouchableOpacity>
      <Icon
        raised
        name={isNotificationDisabled ? 'bell-slash-o' : 'bell'}
        type="font-awesome"
        containerStyle={{
          borderWidth: 1,
          borderColor: isNotificationDisabled
            ? theme.colors.black6
            : theme.colors.blue,
        }}
        color={isNotificationDisabled ? theme.colors.black6 : theme.colors.blue}
        size={Platform.OS == 'ios' ? 14 : 17}
      />
    </TouchableOpacity>
  );
  return role == 'member' || role == 'admin' ? favoriteButton : <View />;
}
