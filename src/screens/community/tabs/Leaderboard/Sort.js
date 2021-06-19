import React, {memo} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Icon} from 'react-native-elements';

export default memo(function Sort(props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
      }}>
      <TouchableOpacity
        // onPress={() => setIsVisible(true)}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 13,
            color: '#555',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Top Creators
        </Text>
        <View style={{width: 10}}></View>
        <Icon name="caret-down" type="font-awesome" color="#666" size={16} />
      </TouchableOpacity>
      <View style={{width: 20}}></View>
      <TouchableOpacity
        // onPress={() => setIsVisible(true)}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 13,
            color: '#555',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Today
        </Text>
        <View style={{width: 10}}></View>
        <Icon name="caret-down" type="font-awesome" color="#666" size={16} />
      </TouchableOpacity>
    </View>
  );
});
