import React, {memo} from 'react';
import Comment from './Comment';
import CommentGroup from './CommentGroup';
import {useSelector} from 'react-redux';
import {memoizedGetFlatCommentByIdSelector} from '../../redux/selectors/CommentSelectors';

const SingleCommentThread = memo((props) => {
  const {commentId, postId} = props;

  const getFlatCommentSelector = memoizedGetFlatCommentByIdSelector();
  const comment = useSelector((state) =>
    getFlatCommentSelector(state, commentId),
  );
  const {authorDetail, created_at, text, replies} = comment;
  const {_id: authorId, displayname} = authorDetail;
  console.log('running single commentthread');
  return (
    <Comment
      commentId={commentId}
      key={commentId}
      authorId={authorId}
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
