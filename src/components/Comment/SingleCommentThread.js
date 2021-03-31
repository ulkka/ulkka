import React, {memo} from 'react';
import Comment from './Comment';
import CommentGroup from './CommentGroup';
import {useSelector} from 'react-redux';
import {getCommentReplies} from '../../redux/selectors/CommentSelectors';

const SingleCommentThread = memo((props) => {
  const {commentId, level} = props;

  const replies = useSelector((state) => getCommentReplies(state, commentId));

  console.log('running single comment thread', commentId);
  return (
    <Comment commentId={commentId} key={commentId} level={level}>
      {!replies || !replies?.length ? null : (
        <CommentGroup parent={commentId} key={commentId}>
          {replies.map((replyId) => {
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
  );
});

export default SingleCommentThread;
