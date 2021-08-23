import React, {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text, useTheme} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {votePost} from '../redux/actions/PostActions';
import {voteComment} from '../redux/actions/CommentActions';
import {
  getPostUserVote,
  getPostVoteCount,
  getPostVoteIsLoading,
} from '../redux/selectors/PostSelectors';
import {
  getCommentUserVote,
  getCommentVoteCount,
  getCommentVoteIsLoading,
} from '../redux/selectors/CommentSelectors';
import {kFormatter} from './helpers';

export function Vote(props) {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {id, entityType} = props;

  const userVote =
    entityType == 'post'
      ? useSelector(state => getPostUserVote(state, id))
      : useSelector(state => getCommentUserVote(state, id));

  const voteCount =
    entityType == 'post'
      ? useSelector(state => getPostVoteCount(state, id))
      : useSelector(state => getCommentVoteCount(state, id));

  const voteIsLoading =
    entityType == 'post'
      ? useSelector(state => getPostVoteIsLoading(state, id))
      : useSelector(state => getCommentVoteIsLoading(state, id));

  const vote = type => {
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
      disabled={!!voteIsLoading}
      onPress={() => vote(1)}
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
      <Icon
        name={userVote == 1 ? 'arrow-up-bold' : 'arrow-up-bold-outline'}
        type="material-community"
        size={20}
        color={userVote == 1 ? '#ff4301' : theme.colors.black8}
      />
    </TouchableOpacity>
  );

  const TotalVoteCount = (
    <Text
      style={{
        fontWeight: 'bold',
        color:
          userVote == 1
            ? '#ff4301'
            : userVote == -1
            ? '#3b5998'
            : theme.colors.black8,
        paddingHorizontal: 10,
      }}>
      {kFormatter(voteCount)}
    </Text>
  );

  const DownVoteButton = (
    <TouchableOpacity
      disabled={!!voteIsLoading}
      onPress={() => vote(-1)}
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
      <Icon
        name={userVote == -1 ? 'arrow-down-bold' : 'arrow-down-bold-outline'}
        type="material-community"
        size={20}
        color={userVote == -1 ? '#3b5998' : theme.colors.black8}
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
