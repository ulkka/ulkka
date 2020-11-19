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

export const newComment = (new_comment, parent) => ({
  type: Actions.NewComment,
  payload: {
    new_comment: new_comment,
    parent: parent,
  },
});
