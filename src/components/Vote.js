import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {votePost, getPostField} from '../redux/reducers/PostSlice';
import {
  getCommentUserVote,
  getCommentVoteCount,
  voteComment,
} from '../redux/reducers/CommentSlice';

export default function Vote(props) {
  const dispatch = useDispatch();
  const id = props.id;
  const entityType = props.type;

  const selfVote =
    entityType == 'post'
      ? useSelector(getPostField(id, 'userVote'))
      : useSelector((state) => getCommentUserVote(state, id));

  const voteCount =
    entityType == 'post'
      ? useSelector(getPostField(id, 'voteCount'))
      : useSelector((state) => getCommentVoteCount(state, id));

  //console.log(selfVote);

  const vote = (type) => {
    let voteType = selfVote == type ? 0 : type;
    const payload = {id: id, voteType: voteType};
    if (entityType == 'post') {
      dispatch(votePost(payload));
    }
    if (entityType == 'comment') {
      dispatch(voteComment(payload));
    }
  };

  const UpvoteButton = (
    <TouchableOpacity onPress={() => vote(1)}>
      <Icon
        name={selfVote == 1 ? 'arrow-up-bold' : 'arrow-up-bold-outline'}
        type="material-community"
        size={20}
        color={selfVote == 1 ? '#ff4301' : '#888'}
      />
    </TouchableOpacity>
  );

  const TotalVoteCount = (
    <Text
      style={{
        fontWeight: 'bold',
        color: selfVote == 1 ? '#ff4301' : selfVote == -1 ? '#3b5998' : '#888',
        paddingHorizontal: 10,
      }}>
      {voteCount}
    </Text>
  );

  const DownVoteButton = (
    <TouchableOpacity onPress={() => vote(-1)}>
      <Icon
        name={selfVote == -1 ? 'arrow-down-bold' : 'arrow-down-bold-outline'}
        type="material-community"
        size={20}
        color={selfVote == -1 ? '#3b5998' : '#888'}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 120,
        ...props.style,
      }}>
      {UpvoteButton}
      {TotalVoteCount}
      {DownVoteButton}
    </View>
  );
}
