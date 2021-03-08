import React, {memo} from 'react';
import Comment from './Comment';
import CommentGroup from './CommentGroup';
import {useSelector} from 'react-redux';
import {selectFlatCommentById} from '../../redux/selectors/CommentSelectors';

const SingleCommentThread = ({commentId, postId}) => {
  return (
    <SingleCommentTree key={commentId} commentId={commentId} postId={postId} />
  );
};

const SingleCommentTree = React.memo((props) => {
  const {commentId, postId} = props;
  const comment = useSelector(selectFlatCommentById(commentId));
  const {author, created_at, text, userVote, voteCount, replies} = comment;
  const {displayname} = author;

  return (
    <Comment
      commentId={commentId}
      key={commentId}
      authorDisplayname={displayname}
      created_at={created_at}
      text={text}
      userVote={userVote}
      voteCount={voteCount}>
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

export default memo(SingleCommentThread);
