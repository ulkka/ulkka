import React from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import ShareCommunity from './ShareCommunity';
import AutolinkText from '../../components/AutolinkText';
import {useSelector} from 'react-redux';
import {getCommunityTitle} from '../../redux/reducers/CommunitySlice';

export default function GrowCommunity(props) {
  const {communityId} = props.route.params;
  const communityTitle = useSelector((state) =>
    getCommunityTitle(state, communityId),
  );

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
        2) Let others know about your community by sharing the community's
        invite link on various social media platforms
      </Text>
      <View
        style={{
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 10,
          alignSelf: 'flex-start',
          marginTop: 10,
          backgroundColor: '#289df4',
        }}>
        <ShareCommunity
          communityId={communityId}
          text={'Share Invite Link'}
          flexDirection={'row'}
          mode="light"
          shareTextStyle={{
            fontWeight: 'bold',
            fontSize: 15,
            paddingLeft: 5,
          }}
        />
      </View>
      <View style={{height: 30}}></View>
      <AutolinkText
        text={
          '3) Mention your community as  #' +
          communityTitle +
          '  in comments of relevant posts and help more people discover your community'
        }
        source="growCommunity"
        enableShowMore={false}
        textStyle={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#424242',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}
      />
      <View style={{height: 30}}></View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#424242',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        4) You can also increase your community ranking to show up in the top
        community recommendation by creating content and engagement regularly
      </Text>
    </View>
  );
}
