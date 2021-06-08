import React from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {getCommunityModerators} from '../../../redux/reducers/CommunitySlice';
import UserAvatar from '../../../components/UserAvatar';
import {push} from '../../../navigation/Ref';

export default function CommunityModerators(props) {
  const {communityId} = props;
  const communityAdmins = useSelector((state) =>
    getCommunityModerators(state, communityId),
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: 10}}>
      {communityAdmins.map((communityAdmin) => {
        const {displayname: adminDisplayname, _id: adminId} = communityAdmin;
        return (
          <TouchableOpacity
            key={adminId}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 7,
            }}
            onPress={() => push('UserDetail', {userId: adminId})}>
            <UserAvatar seed={adminDisplayname} size={'large'} />
            <Text
              style={{
                padding: 10,
                color: '#444',
                fontWeight: 'bold',
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              {adminDisplayname}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
