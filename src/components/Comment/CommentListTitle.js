import React, {memo} from 'react';
import {Text, View} from 'react-native';

const CommentListTitle = () => {
  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#eee',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#777',
          fontSize: 13,
          width: '100%',
        }}>
        Comments
      </Text>
    </View>
  );
};

export default memo(CommentListTitle);
