import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {getPostField} from '../../redux/reducers/PostSlice';
import {useSelector} from 'react-redux';
import ReadMoreText from '../ReadMoreText';

const TextPostContent = (props) => {
  const postId = props.postId;
  const postDescription = useSelector(getPostField(postId, 'description'));

  return (
    <View>
      <ReadMoreText numberOfLines={10}>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 21,
          }}>
          {postDescription}
        </Text>
      </ReadMoreText>
    </View>
  );
};

export default memo(TextPostContent);
