import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {navigate} from '../navigation/Ref';

export default function CommunityExplorerButton(props) {
  const {theme} = useTheme();
  return (
    <TouchableOpacity
      style={{paddingRight: 5}}
      onPress={() => {
        navigate('CommunityExplorer');
      }}>
      <Icon
        name="star-four-points-outline"
        type="material-community"
        size={24}
        color={theme.colors.black4}
      />
    </TouchableOpacity>
  );
}
