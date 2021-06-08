import React from 'react';
import {View, Text, TouchableOpacity, Switch} from 'react-native';
import {Icon, CheckBox} from 'react-native-elements';
import {push, navigate} from '../../navigation/Ref';

export default function CommunitySettings(props) {
  const isEnabled = true;
  const optionViewStyle = {
    borderBottomWidth: 1,
    borderColor: '#ddd',
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
      title: 'Community Admin',
      onPress: () => navigate('CommunityAdminSettings'),
    },
    {
      title: 'Banned Users',
      onPress: () => navigate('BannedMembers'),
    },
    {
      title: 'Admin Notifications',
      onPress: () => navigate('BannedMembers'),
      componentRight: (
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          // onValueChange={toggleSwitch}
          value={isEnabled}
        />
      ),
    },
  ];
  return (
    <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
      {settingsList.map((setting, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={setting.onPress}
            style={optionViewStyle}>
            <Text>{setting.title}</Text>
            {setting.componentRight ? (
              setting.componentRight
            ) : (
              <Icon
                name="arrow-right"
                type="font-awesome"
                size={18}
                color="#444"
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
