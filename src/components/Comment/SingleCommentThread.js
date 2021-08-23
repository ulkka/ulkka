import React, {memo} from 'react';
import {View} from 'react-native';
import Comment from './Comment';
import CommentGroup from './CommentGroup';
import {useSelector} from 'react-redux';
import {
  getCommentReplies,
  getCommentAuthorId,
} from '../../redux/selectors/CommentSelectors';
import {getBlockedUsers} from '../../redux/reducers/AuthSlice';

const SingleCommentThread = memo(props => {
  const {commentId, level} = props;

  const replies = useSelector(state => getCommentReplies(state, commentId));
  const commentAuthorId = useSelector(state =>
    getCommentAuthorId(state, commentId),
  );
  const blockedUsers = useSelector(getBlockedUsers);
  const isAuthorBlocked =
    blockedUsers && blockedUsers.includes(commentAuthorId);

  return !isAuthorBlocked ? (
    <Comment commentId={commentId} key={commentId} level={level}>
      {!replies || !replies?.length ? null : (
        <CommentGroup parent={commentId} key={commentId}>
          {replies.map(replyId => {
            return (
              <SingleCommentThread
                commentId={replyId}
                key={replyId}
                level={level + 1}
              />
            );
          })}
        </CommentGroup>
      )}
    </Comment>
  ) : (
    <View></View>
  );
});

export default SingleCommentThread;
