import React, {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {votePost} from '../redux/actions/PostActions';
import {voteComment} from '../redux/actions/CommentActions';
import {
  getPostUserVoteSelector,
  getPostVoteCountSelector,
} from '../redux/selectors/PostSelectors';
import {
  getCommentUserVoteSelector,
  getCommentVoteCountSelector,
} from '../redux/selectors/CommentSelectors';

export function Vote(props) {
  const dispatch = useDispatch();
  const {id, entityType} = props;

  console.log('running vote');
  const postUserVoteSelector = getPostUserVoteSelector();
  const voteCountSelector = getPostVoteCountSelector();

  const commentUserVoteSelector = getCommentUserVoteSelector();
  const commentVoteCountSelector = getCommentVoteCountSelector();

  const userVote =
    entityType == 'post'
      ? useSelector((state) => postUserVoteSelector(state, id))
      : useSelector((state) => commentUserVoteSelector(state, id));

  const voteCount =
    entityType == 'post'
      ? useSelector((state) => voteCountSelector(state, id))
      : useSelector((state) => commentVoteCountSelector(state, id));

  const vote = (type) => {
    let voteType = userVote == type ? 0 : type;
    const payload = {id: id, voteType: voteType};
    if (entityType == 'post') {
      dispatch(votePost(payload));
    }
    if (entityType == 'comment') {
      dispatch(voteComment(payload));
    }
  };

  const UpvoteButton = (
    <TouchableOpacity
      onPress={() => vote(1)}
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
      <Icon
        name={userVote == 1 ? 'arrow-up-bold' : 'arrow-up-bold-outline'}
        type="material-community"
        size={20}
        color={userVote == 1 ? '#ff4301' : '#888'}
      />
    </TouchableOpacity>
  );

  const TotalVoteCount = (
    <Text
      style={{
        fontWeight: 'bold',
        color: userVote == 1 ? '#ff4301' : userVote == -1 ? '#3b5998' : '#888',
        paddingHorizontal: 10,
      }}>
      {voteCount}
    </Text>
  );

  const DownVoteButton = (
    <TouchableOpacity
      onPress={() => vote(-1)}
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
      <Icon
        name={userVote == -1 ? 'arrow-down-bold' : 'arrow-down-bold-outline'}
        type="material-community"
        size={20}
        color={userVote == -1 ? '#3b5998' : '#888'}
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

export default memo(Vote);
