import React, {memo} from 'react';
import Comment from './Comment';
import CommentGroup from './CommentGroup';
import {useSelector} from 'react-redux';
import {selectFlatCommentByIdSelector} from '../../redux/selectors/CommentSelectors';

const SingleCommentThread = memo((props) => {
  const {commentId, postId} = props;

  const getFlatCommentSelector = selectFlatCommentByIdSelector();
  const comment = useSelector((state) =>
    getFlatCommentSelector(state, commentId),
  );
  const {authorDetail, created_at, text, replies} = comment;
  const {displayname} = authorDetail;

  return (
    <Comment
      commentId={commentId}
      key={commentId}
      authorDisplayname={displayname}
      created_at={created_at}
      text={text}>
      {replies === undefined ? null : (
        <CommentGroup parent={commentId} key={commentId}>
          {replies.map((replyId) => {
            return (
              <SingleCommentThread
                commentId={replyId}
                key={replyId}
                postId={postId}
              />
            );
          })}
        </CommentGroup>
      )}
    </Comment>
  );
});

export default SingleCommentThread;
