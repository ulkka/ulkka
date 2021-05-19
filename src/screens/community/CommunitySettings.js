import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {navigate} from '../../navigation/Ref';

export default function CommunitySettings(props) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff', padding: 20}}>
      <TouchableOpacity
        onPress={() => navigate('UpdateCommunityDescription')}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Update Community Description</Text>
        <Icon name="arrow-right" type="font-awesome" size={18} color="#444" />
      </TouchableOpacity>
      <View style={{height: 20}}></View>
      <TouchableOpacity
        onPress={() => navigate('UpdateCommunityRules')}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Update Community Rules</Text>
        <Icon name="arrow-right" type="font-awesome" size={18} color="#444" />
      </TouchableOpacity>
      <View style={{height: 20}}></View>
      <TouchableOpacity
        onPress={() => navigate('ChangeCommunityIcon')}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Change Community Icon</Text>
        <Icon name="arrow-right" type="font-awesome" size={18} color="#444" />
      </TouchableOpacity>
      <View style={{height: 20}}></View>
      <TouchableOpacity
        onPress={() => navigate('CommunityMembers')}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text>Community Members</Text>
        <Icon name="arrow-right" type="font-awesome" size={18} color="#444" />
      </TouchableOpacity>
    </View>
  );
}
