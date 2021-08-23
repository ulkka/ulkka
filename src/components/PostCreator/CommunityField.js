import React from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';

export const CommunityField = props => {
  const {onPress, community} = props;
  const {theme} = useTheme();

  return (
    <View style={{}}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: theme.colors.black5,
              fontSize: 18,
              fontWeight: 'bold',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {!community?.name ? 'Select Community' : community.name}
          </Text>
          <View style={{width: 20}}></View>
          <Icon
            name="angle-down"
            size={18}
            color={theme.colors.black3}
            type="font-awesome-5"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
