import React, {memo} from 'react';
import {Text, TouchableWithoutFeedback} from 'react-native';
import {push} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {getPostTitle} from '../../redux/selectors/PostSelectors';

const PostTitle = (props) => {
  const {postId} = props;
  const postTitle = useSelector((state) => getPostTitle(state, postId));
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        push('PostDetail', {
          postId: postId,
        });
      }}>
      <Text
        style={{
          fontSize: 15,
          paddingVertical: 10,
          marginLeft: 3,
          fontWeight: 'bold',
          color: '#444',
        }}>
        {postTitle}
      </Text>
    </TouchableWithoutFeedback>
  );
};

export default memo(PostTitle);
