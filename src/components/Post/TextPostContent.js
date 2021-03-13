import React, {memo} from 'react';
import {View, Text} from 'react-native';
import ReadMoreText from '../ReadMoreText';

const TextPostContent = (props) => {
  const {description} = props;
  return (
    <View
      style={{
        alignItems: 'flex-start',
      }}>
      {
        //  <ReadMoreText numberOfLines={10}>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 21,
          }}>
          {description}
        </Text>
        //   </ReadMoreText>
      }
    </View>
  );
};

export default memo(TextPostContent);
