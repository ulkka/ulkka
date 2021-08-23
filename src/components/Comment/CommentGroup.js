import React, {memo, useContext} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';

function CommentGroup(props) {
  const {theme} = useContext(ThemeContext);
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
