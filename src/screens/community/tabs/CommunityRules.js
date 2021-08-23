import React, {useContext} from 'react';
import {View, Text, Platform} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getCommunityRules} from '../../../redux/reducers/CommunitySlice';

export default function CommunityRules(props) {
  const {communityId} = props;
  const {theme} = useContext(ThemeContext);

  const communityRules = useSelector(state =>
    getCommunityRules(state, communityId),
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary, padding: 15}}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {communityRules}
      </Text>
    </View>
  );
}
