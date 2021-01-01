import * as Actions from './ActionTypes';

export const AddComment = (comments) => ({
  type: Actions.AddComment,
  payload: {
    comments: comments,
  },
});

export const prepareComment = (post_id, post_title) => ({
  type: Actions.PrepareComment,
  payload: {
    post_id: post_id,
    post_title: post_title,
  },
});

export const prepareReply = (
  post_id,
  post_title,
  comment_id,
  comment_author,
) => ({
  type: Actions.PrepareReply,
  payload: {
    post_id: post_id,
    post_title: post_title,
    comment_id: comment_id,
    comment_author: comment_author,
  },
});

export const appendNewComment = (new_comment, parent) => ({
  type: Actions.NewComment,
  payload: {
    new_comment: new_comment,
    parent: parent,
  },
});

export function newComment(new_comment, parent, postId) {
  return (dispatch) => {
    dispatch(appendNewComment(new_comment, parent));
    dispatch(increaseCommentCount(postId));
  };
}

export const increaseCommentCount = (postId) => ({
  type: Actions.increaseCommentCount,
  payload: {
    postId: postId,
  },
});

export const decreaseCommentCount = (postId) => ({
  type: Actions.decreaseCommentCount,
  payload: {
    postId: postId,
  },
});
