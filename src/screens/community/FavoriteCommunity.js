import React from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsCommunityFavorite,
  favoriteCommunity,
  unfavoriteCommunity,
  getUserRoleInCommunity,
} from '../../redux/reducers/CommunitySlice';

export default function FavoriteCommunity(props) {
  const {theme} = useTheme();

  const dispatch = useDispatch();
  const {communityId, text, shareTextStyle} = props;
  const isFavorite = useSelector(state =>
    getIsCommunityFavorite(state, communityId),
  );
  const role = useSelector(state => getUserRoleInCommunity(state, communityId));

  const favoriteButton = (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
      }}
      onPress={() => {
        if (!isFavorite) {
          dispatch(favoriteCommunity(communityId));
        } else {
          dispatch(unfavoriteCommunity(communityId));
        }
      }}>
      <Icon
        //raised
        reverse
        borderRadius={1}
        reverseColor={isFavorite ? '#444' : '#eee'}
        containerStyle={{
          margin: 0,
          borderWidth: isFavorite ? 0.35 : 0,
          borderColor: '#999',
        }}
        name={isFavorite ? 'star' : 'star-o'}
        type="font-awesome"
        color={isFavorite ? '#f9dc5f' : '#444'}
        size={Platform.OS == 'ios' ? 14 : 12}
      />
      {text && (
        <View>
          <View style={{height: 2}}></View>
          <Text
            style={{
              ...shareTextStyle,
              ...{
                color: theme.colors.black3,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              },
            }}>
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
  return role == 'member' || role == 'admin' ? favoriteButton : <View />;
}
