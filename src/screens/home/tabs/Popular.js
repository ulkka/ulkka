import React, {memo, useContext} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import Feed from '../../../components/Feed/Feed';

function Popular(props) {
  const {theme} = useContext(ThemeContext);

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.primary}}>
      <Feed {...props} />
    </View>
  );
}

export default memo(Popular);
