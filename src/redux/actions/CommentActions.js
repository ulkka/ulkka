import * as Actions from './ActionTypes';

export const AddComment = (comments) => ({
  type: Actions.AddComment,
  payload: {
    comments: comments,
  },
});
