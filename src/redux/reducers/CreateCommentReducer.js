import * as Actions from '../actions/ActionTypes';

const INITIAL_AUTH_STATE = {
  reply_to: 'post',
  post_id: null,
  post_title: '',
  comment_id: null,
  comment_author: '',
};

const CreateCommentReducer = (state = INITIAL_AUTH_STATE, action) => {
  let {reply_to, post_id, post_title, comment_id, comment_author} = state;

  switch (action.type) {
    case Actions.PrepareComment:
      reply_to = 'post';
      post_id = action.payload.post_id;
      post_title = action.payload.post_title;

      return {reply_to, post_id, post_title};

    case Actions.PrepareReply:
      reply_to = 'comment';
      post_id = action.payload.post_id;
      post_title = action.payload.post_title;
      comment_id = action.payload.comment_id;
      comment_author = action.payload.comment_author;

      return {reply_to, post_id, post_title, comment_id, comment_author};

    default:
      return state;
  }
};

export default CreateCommentReducer;
