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
      title: 'Change Community Description',
      onPress: () => navigate('UpdateCommunityDescription'),
    },
    {
      title: 'Change Community Rules',
      onPress: () => navigate('UpdateCommunityRules'),
    },
    {
      title: 'Change Community Icon',
      onPress: () => navigate('ChangeCommunityIcon'),
    },
    {
      title: 'Community Members',
      onPress: () => navigate('CommunityMembers'),
    },
    {
      title: 'Community Admins',
      onPress: () => navigate('CommunityAdminSettings'),
    },
    {
      title: 'Banned Users',
      onPress: () => navigate('BannedMembers'),
    },
    {
      title: 'Admin Notifications',
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
