import React, {useState, useContext} from 'react';
import {View, Text, TouchableOpacity, Platform, Animated} from 'react-native';
import {Icon, ThemeContext} from 'react-native-elements';
import CommunityRules from './CommunityRules';
import CommunityModerators from './CommunityModerators';

export default function About(props) {
  const {communityId} = props;
  const {theme} = useContext(ThemeContext);

  const [rulesCollapsed, setRulesCollapsed] = useState(true);
  const [moderatorsCollapsed, setModeratorsCollapsed] = useState(true);

  const RulesSection = (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: rulesCollapsed
            ? theme.colors.primary
            : theme.colors.grey0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.grey2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}
        onPress={() => {
          setRulesCollapsed(!rulesCollapsed);
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            color: theme.colors.black5,
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
          backgroundColor: moderatorsCollapsed
            ? theme.colors.primary
            : theme.colors.grey0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.grey2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
        }}
        onPress={() => {
          setModeratorsCollapsed(!moderatorsCollapsed);
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Admins
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
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 5,
      }}
      {...props}>
      {RulesSection}
      <View style={{height: 10}}></View>
      {ModeratorsSection}
    </Animated.ScrollView>
  );
}
