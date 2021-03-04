import React from 'react';
import {Comment, CommentGroup} from './Comment';
import {useSelector} from 'react-redux';
import {getCommentReplies} from '../../redux/reducers/CommentSlice';

function ReplyTree(reply, index) {
  return <CommentTree key={reply} commentId={reply} index={index} />;
}

function CommentTree(props) {
  const {commentId, index} = props;
  const replies = useSelector((state) => getCommentReplies(state, commentId));

  return (
    <Comment commentId={commentId} index={index}>
      {replies === undefined ? null : (
        <CommentGroup parent={commentId}>
          {replies.map((reply, index) => {
            return ReplyTree(reply, index);
          })}
        </CommentGroup>
      )}
    </Comment>
  );
}

export default CommentTree;
