import React, {memo} from 'react';
import {View} from 'react-native';

function CommentGroup(props) {
  return (
    <View
      style={{
        borderLeftWidth: 1,
        borderColor: '#eee',
        paddingVertical: 5,
        marginLeft: 0,
      }}>
      {props.children}
    </View>
  );
}

export default memo(CommentGroup);
