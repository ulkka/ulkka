import React from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {getCommunityModerators} from '../../../redux/reducers/CommunitySlice';
import UserAvatar from '../../../components/UserAvatar';
import {navigate} from '../../../navigation/Ref';

export default function CommunityModerators(props) {
  const {communityId} = props;
  const communityAdmins = useSelector((state) =>
    getCommunityModerators(state, communityId),
  );

  const communityAdmin = communityAdmins && communityAdmins[0];
  const adminDisplayname = communityAdmin?.displayname;
  const adminId = communityAdmin?._id;

  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: 10}}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => navigate('UserDetail', {userId: adminId})}>
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
    </View>
  );
}
