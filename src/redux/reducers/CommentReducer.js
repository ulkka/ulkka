import * as Actions from '../actions/ActionTypes';

const INITIAL_COMMENT_STATE = {
  comments: [],
  reply_to: 'post',
  post_id: null,
  post_title: '',
  comment_id: null,
  comment_author: '',
  new_comment: null,
};

const CommentReducer = (state = INITIAL_COMMENT_STATE, action) => {
  let {
    reply_to,
    post_id,
    post_title,
    comment_id,
    comment_author,
    comments,
    new_comment,
  } = state;

  switch (action.type) {
    case Actions.AddComment:
      comments = action.payload.comments;
      return {
        comments,
        reply_to,
        post_id,
        post_title,
        comment_id,
        comment_author,
        new_comment,
      };

    case Actions.PrepareComment:
      reply_to = 'post';
      post_id = action.payload.post_id;
      post_title = action.payload.post_title;
      comment_id = null;
      comment_author = '';

      return {
        comments,
        reply_to,
        post_id,
        post_title,
        comment_id,
        comment_author,
        new_comment,
      };

    case Actions.PrepareReply:
      reply_to = 'comment';
      post_id = action.payload.post_id;
      post_title = action.payload.post_title;
      comment_id = action.payload.comment_id;
      comment_author = action.payload.comment_author;

      return {
        comments,
        reply_to,
        post_id,
        post_title,
        comment_id,
        comment_author,
        new_comment,
      };

    case Actions.NewComment:
      new_comment = action.payload.new_comment;
      new_comment.userVote = 0;
      const commentMapper = (comments, parent) => {
        comments.map((item, index) => {
          if (item._id == action.payload.parent) {
            if (item.replies !== undefined) {
              item.replies.push(new_comment);
            } else {
              item.replies = [];
              item.replies.push(new_comment);
            }
          } else if (item.replies !== undefined) {
            commentMapper(item.replies, parent);
          }
        });
      };
      if (action.payload.parent == 'post') {
        comments.push(new_comment);
      } else {
        commentMapper(comments, action.payload.parent);
      }
      return {
        comments,
        reply_to,
        post_id,
        post_title,
        comment_id,
        comment_author,
        new_comment,
      };

    default:
      return state;
  }
};

export default CommentReducer;
