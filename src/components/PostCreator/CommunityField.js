import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

export const CommunityField = (props) => {
  const {onPress, community} = props;

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          height: 50,
          width: '95%',
          alignSelf: 'center',
          marginBottom: 50,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Text style={{color: '#555', fontSize: 18, fontWeight: 'bold'}}>
            {community == null ? 'Select Community' : community.name}
          </Text>
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
