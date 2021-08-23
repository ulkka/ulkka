import React, {memo} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-elements';

function CommentGroup(props) {
  const {theme} = useTheme();
  return (
    <View
      style={{
        borderLeftWidth: 1,
        borderColor: theme.colors.grey2,
        paddingVertical: 5,
        marginLeft: 0,
      }}>
      {props.children}
    </View>
  );
}

export default memo(CommentGroup);
