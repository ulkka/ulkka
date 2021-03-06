import React, {memo} from 'react';
import Comment from './Comment';
import CommentGroup from './CommentGroup';
import {useSelector} from 'react-redux';
import {getCommentReplies} from '../../redux/reducers/CommentSlice';

const CommentTree = ({commentId}) => {
  return <CommentWithReplies key={commentId} commentId={commentId} />;
};

function CommentWithReplies(props) {
  const {commentId} = props;
  const replies = useSelector((state) => getCommentReplies(state, commentId));

  return (
    <Comment commentId={commentId} key={commentId}>
      {replies === undefined ? null : (
        <CommentGroup parent={commentId} key={commentId}>
          {replies.map((replyId) => {
            return <CommentTree commentId={replyId} key={replyId} />;
          })}
        </CommentGroup>
      )}
    </Comment>
  );
}

export default CommentTree;
