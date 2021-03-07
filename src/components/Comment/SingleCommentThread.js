import React, {memo} from 'react';
import Comment from './Comment';
import CommentGroup from './CommentGroup';
import {useSelector} from 'react-redux';
import {selectCommentById} from '../../redux/reducers/CommentSlice';

const SingleCommentThread = ({commentId}) => {
  return <SingleCommentTree key={commentId} commentId={commentId} />;
};

function SingleCommentTree(props) {
  const {commentId} = props;
  const comment = useSelector((state) => selectCommentById(state, commentId));
  const replies = comment.replies;

  return (
    <Comment commentId={commentId} key={commentId} comment={comment}>
      {replies === undefined ? null : (
        <CommentGroup parent={commentId} key={commentId} comment={comment}>
          {replies.map((replyId) => {
            return (
              <SingleCommentThread
                commentId={replyId}
                key={replyId}
                comment={comment}
              />
            );
          })}
        </CommentGroup>
      )}
    </Comment>
  );
}

export default memo(SingleCommentThread);
