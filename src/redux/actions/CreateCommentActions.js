import * as Actions from './ActionTypes';

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
