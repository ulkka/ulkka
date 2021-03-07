import React, {memo} from 'react';
import {View, Text} from 'react-native';
import ReadMoreText from '../ReadMoreText';

const CommentBody = (props) => {
  const {text} = props;

  return (
    <View style={{paddingTop: 5}}>
      <ReadMoreText numberOfLines={5}>
        <Text
          style={{
            color: '#333',
            fontSize: 13,
            fontWeight: '400',
            lineHeight: 18,
          }}>
          {text}
        </Text>
      </ReadMoreText>
    </View>
  );
};

export default memo(CommentBody);
