import React, {memo} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-elements';
import Feed from '../../../components/Feed/Feed';

function Popular(props) {
  const {theme} = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <Feed {...props} />
    </View>
  );
}

export default memo(Popular);
