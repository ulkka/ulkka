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
        1) You can invite users to join your community from their profile page
        in Ulkka
      </Text>
      <View style={{height: 30}}></View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#424242',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        2) Share your community on different social media platforms to spread
        the word about your community
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
        community recommendation by creating posts and engagement regularly
      </Text>
    </View>
  );
}
