import React, {memo} from 'react';
import {View, Text} from 'react-native';

const PostTitle = (props) => {
  const {postTitle} = props;

  return (
    <View>
      <Text
        style={{
          fontSize: 15,
          paddingVertical: 10,
          fontWeight: 'bold',
          color: '#555',
        }}>
        {postTitle}
      </Text>
    </View>
  );
};

export default memo(PostTitle);
