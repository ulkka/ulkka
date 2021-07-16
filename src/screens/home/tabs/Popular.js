import React, {memo} from 'react';
import {View} from 'react-native';
import Feed from '../../../components/Feed/Feed';

function Popular(props) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Feed {...props} />
    </View>
  );
}

export default memo(Popular);
