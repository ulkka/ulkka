import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import Vote from '../Vote';
import PostExtraOptions from '../PostExtraOptions';
import {prepareReply} from '../../redux/reducers/ReplySlice';
import {useDispatch} from 'react-redux';

const CommentFooter = (props) => {
  const dispatch = useDispatch();

  const commentId = props.commentId;

  const ReplyToComment = (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center'}}
      onPress={() => {
        dispatch(prepareReply({commentId: commentId}));
      }}>
      <Icon name="reply" type="font-awesome" size={14} color="#777" />
      <Text style={{paddingHorizontal: 10, color: '#444', fontSize: 12}}>
        Reply
      </Text>
    </TouchableOpacity>
  );

  const VoteComment = (
    <Vote
      id={commentId}
      type="comment"
      style={{paddingHorizontal: 15}}
      type="comment"
    />
  );

  const ExtraOptions = (
    <View style={{paddingHorizontal: 40}}>
      <PostExtraOptions id={commentId} optionType="comment" />
    </View>
  );

  return (
    <View
      style={{
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
      }}>
      {ExtraOptions}
      {ReplyToComment}
      {VoteComment}
    </View>
  );
};

export default CommentFooter;
