import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, Platform, Alert} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {
  getCommunityModerators,
  dismissAdmin,
} from '../../redux/reducers/CommunitySlice';
import UserAvatar from '../../components/UserAvatar';
import {push} from '../../navigation/Ref';
import {getRegisteredUser} from '../../redux/reducers/AuthSlice';
import {useSelector, useDispatch} from 'react-redux';

export default function CommunityAdminSettings(props) {
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);

  const {communityId} = props.route.params;
  const communityAdmins = useSelector(state =>
    getCommunityModerators(state, communityId),
  );
  const registeredUser = useSelector(getRegisteredUser);
  const registeredUserId = registeredUser._id;

  const dismissAsAdmin = async (communityId, user) => {
    dispatch(dismissAdmin({communityId, user}));
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary, padding: 12}}>
      {communityAdmins.map(communityAdmin => {
        const {displayname: adminDisplayname, _id: adminId} = communityAdmin;

        return (
          <TouchableOpacity
            key={adminId}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 7,
              justifyContent: 'space-between',
            }}
            onPress={() => push('UserDetail', {userId: adminId})}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <UserAvatar seed={adminDisplayname} size={'large'} />
              <Text
                style={{
                  padding: 10,
                  color: theme.colors.black4,
                  fontWeight: 'bold',
                  ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                }}>
                {adminDisplayname}
              </Text>
            </View>
            {registeredUserId !== communityAdmin._id && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Dismiss ' +
                        adminDisplayname +
                        ' as an admin of this community?',
                      null,
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: async () => {
                            const res = await dismissAsAdmin(
                              communityId,
                              communityAdmin,
                            );
                            res && setIsAdmin(false);
                          },
                        },
                      ],
                      {cancelable: true},
                    );
                  }}
                  style={{
                    backgroundColor: theme.colors.blue,
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <Text style={{fontSize: 10, color: theme.colors.primary}}>
                    Dismiss as Admin
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
