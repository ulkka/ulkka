import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import Vote from '../Vote';
import ExtraOptions from '../ExtraOptions';
import {prepareReply} from '../../redux/reducers/CommentWriterSlice';
import {useDispatch} from 'react-redux';

const CommentFooter = (props) => {
  const dispatch = useDispatch();

  const {commentId} = props;

  const ReplyToComment = (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center'}}
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
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
    <Vote id={commentId} entityType="comment" style={{paddingHorizontal: 15}} />
  );

  const CommentExtraOptions = (
    <View style={{paddingHorizontal: 40}}>
      <ExtraOptions id={commentId} type="comment" />
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
      {CommentExtraOptions}
      {ReplyToComment}
      {VoteComment}
    </View>
  );
};

export default memo(CommentFooter);
