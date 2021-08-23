import React from 'react';
import {View, Text, Platform} from 'react-native';
import {useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getCommunityRules} from '../../../redux/reducers/CommunitySlice';

export default function CommunityRules(props) {
  const {communityId} = props;
  const {theme} = useTheme();

  const communityRules = useSelector(state =>
    getCommunityRules(state, communityId),
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        padding: 15,
        marginHorizontal: 5,
      }}>
      <Text
        style={{
          color: theme.colors.black5,
          fontSize: 13,
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {communityRules}
      </Text>
    </View>
  );
}
