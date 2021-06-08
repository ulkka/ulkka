import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

export const CommunityField = (props) => {
  const {onPress, community} = props;

  return (
    <View style={{}}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          height: 50,
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text style={{color: '#555', fontSize: 18, fontWeight: 'bold'}}>
            {!community?.name ? 'Select Community' : '#' + community.name}
            {'  '}
          </Text>
          <View style={{width: 20}}></View>
          <Icon
            name="angle-down"
            size={18}
            color="#333"
            type="font-awesome-5"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
