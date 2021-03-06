import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {selectCommentById} from '../../redux/reducers/CommentSlice';
import ReadMoreText from '../ReadMoreText';

const CommentBody = (props) => {
  const commentId = props.commentId;
  const comment = useSelector((state) => selectCommentById(state, commentId));

  console.log('commentbody', comment.text);

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
          {comment.text}
        </Text>
      </ReadMoreText>
    </View>
  );
};

export default memo(CommentBody);
