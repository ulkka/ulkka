import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform, Animated} from 'react-native';
import {Icon} from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import CommunityRules from './CommunityRules';
import CommunityModerators from './CommunityModerators';

export default function About(props) {
  const {communityId} = props;
  const [rulesCollapsed, setRulesCollapsed] = useState(true);
  const [moderatorsCollapsed, setModeratorsCollapsed] = useState(true);

  const RulesSection = (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: rulesCollapsed ? '#fff' : '#fafafa',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}
        onPress={() => {
          console.log('pressed');
          setRulesCollapsed(!rulesCollapsed);
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Rules
        </Text>
        <Icon name={rulesCollapsed ? 'expand-more' : 'expand-less'} size={20} />
      </TouchableOpacity>
      {!rulesCollapsed && <CommunityRules communityId={communityId} />}
    </View>
  );
  const ModeratorsSection = (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: moderatorsCollapsed ? '#fff' : '#fafafa',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}
        onPress={() => {
          console.log('pressed');
          setModeratorsCollapsed(!moderatorsCollapsed);
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Moderators
        </Text>
        <Icon
          name={moderatorsCollapsed ? 'expand-more' : 'expand-less'}
          size={20}
        />
      </TouchableOpacity>
      {!moderatorsCollapsed && (
        <CommunityModerators communityId={communityId} />
      )}
    </View>
  );

  return (
    <Animated.ScrollView
      style={{
        flex: 1,
        marginTop: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 5,
      }}
      {...props}>
      {RulesSection}
      <View style={{height: 10}}></View>
      {ModeratorsSection}
    </Animated.ScrollView>
  );
}
