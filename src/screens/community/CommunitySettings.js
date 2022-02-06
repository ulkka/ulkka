import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {navigate} from '../../navigation/Ref';
import ToggleAdminNotifications from './ToggleAdminNotifications';
import {useTranslation} from 'react-i18next';

export default memo(function CommunitySettings(props) {
  const {theme} = useTheme();
  const {t} = useTranslation();

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
      title: t('Change Community Description'),
      onPress: () => navigate('UpdateCommunityDescription'),
    },
    {
      title: t('Change Community Rules'),
      onPress: () => navigate('UpdateCommunityRules'),
    },
    {
      title: t('Change Community Icon'),
      onPress: () => navigate('ChangeCommunityIcon'),
    },
    {
      title: t('Community Members'),
      onPress: () => navigate('CommunityMembers'),
    },
    {
      title: t('Community Admins'),
      onPress: () => navigate('CommunityAdminSettings'),
    },
    {
      title: t('Banned Users'),
      onPress: () => navigate('BannedMembers'),
    },
    {
      title: t('Admin Notifications'),
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
