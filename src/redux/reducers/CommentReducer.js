import * as Actions from '../actions/ActionTypes';

const INITIAL_AUTH_STATE = {
  comments: [],
};

const CommentReducer = (state = INITIAL_AUTH_STATE, action) => {
  let {comments} = state;

  switch (action.type) {
    case Actions.AddComment:
      comments = action.payload.comments;

      return {comments};

    default:
      return state;
  }
};

export default CommentReducer;
