import React, {memo} from 'react';
import {View, Text, Platform} from 'react-native';

const PostTitle = (props) => {
  const {postTitle} = props;

  return (
    <View>
      <Text
        style={{
          fontSize: 15,
          paddingVertical: 10,
          marginLeft: Platform.OS == 'ios' ? 3 : 0,
          fontWeight: 'bold',
          color: '#555',
        }}>
        {postTitle}
      </Text>
    </View>
  );
};

export default memo(PostTitle);
