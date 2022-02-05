import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {navigate} from '../../navigation/Ref';
import ToggleAdminNotifications from './ToggleAdminNotifications';

export default memo(function CommunitySettings(props) {
  const {theme} = useTheme();

  const optionViewStyle = {
    borderBottomWidth: 1,
    borderColor: theme.colors.grey3,
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const settingsList = [
    {
      title: 'Ganti deskripsi komunitas',
      onPress: () => navigate('UpdateCommunityDescription'),
    },
    {
      title: 'Ganti peraturan komunitas',
      onPress: () => navigate('UpdateCommunityRules'),
    },
    {
      title: 'Ganti icon komunitas',
      onPress: () => navigate('ChangeCommunityIcon'),
    },
    {
      title: 'Anggota komunitas',
      onPress: () => navigate('CommunityMembers'),
    },
    {
      title: 'Admin komunitas',
      onPress: () => navigate('CommunityAdminSettings'),
    },
    {
      title: 'Anggota yang diblok',
      onPress: () => navigate('BannedMembers'),
    },
    {
      title: 'Notifikasi admin',
      componentRight: () => <ToggleAdminNotifications {...props} />,
    },
  ];
  return (
    <View
      style={{flex: 1, backgroundColor: theme.colors.primary, paddingTop: 10}}>
      {settingsList.map((setting, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={setting.onPress}
            style={optionViewStyle}>
            <Text style={{color: theme.colors.black4}}>{setting.title}</Text>
            {setting.componentRight ? (
              setting.componentRight()
            ) : (
              <Icon
                name="arrow-right"
                type="font-awesome"
                size={18}
                color={theme.colors.black4}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
});
