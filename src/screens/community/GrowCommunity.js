import React from 'react';
import {View, Text, Platform} from 'react-native';

export default function GrowCommunity(props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#424242',

          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        1) Invite users to join your community from their profile page in Ulkka
      </Text>
      <View style={{height: 30}}></View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#424242',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        2) Let others know about your community by sharing the community's link
        on various social media platforms
      </Text>
      <View style={{height: 30}}></View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#424242',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        3) You can increase your community ranking to show up in the top
        community recommendation by creating content and engagement regularly
      </Text>
    </View>
  );
}
