import React from 'react';
import {Text, View} from 'react-native';

const CommentListTitle = () => {
  return (
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#eee',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#888',
          fontSize: 13,
          width: '100%',
        }}>
        Comments
      </Text>
    </View>
  );
};

export default CommentListTitle;
