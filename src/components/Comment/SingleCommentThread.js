import React, {memo} from 'react';
import Comment from './Comment';
import CommentGroup from './CommentGroup';
import {useSelector} from 'react-redux';
import {getCommentReplies} from '../../redux/selectors/CommentSelectors';

const SingleCommentThread = memo((props) => {
  const {commentId} = props;

  const replies = useSelector((state) => getCommentReplies(state, commentId));

  return (
    <Comment commentId={commentId} key={commentId}>
      {!replies || !replies?.length ? null : (
        <CommentGroup parent={commentId} key={commentId}>
          {replies.map((replyId) => {
            return <SingleCommentThread commentId={replyId} key={replyId} />;
          })}
        </CommentGroup>
      )}
    </Comment>
  );
});

export default SingleCommentThread;
