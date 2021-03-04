import React from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {selectCommentById} from '../../redux/reducers/CommentSlice';

const CommentBody = (props) => {
  const commentId = props.commentId;
  const comment = useSelector((state) => selectCommentById(state, commentId));

  return (
    <View style={{paddingTop: 5}}>
      <Text style={{color: '#333', fontSize: 13, fontWeight: '400'}}>
        {comment.text}
      </Text>
    </View>
  );
};

export default CommentBody;
