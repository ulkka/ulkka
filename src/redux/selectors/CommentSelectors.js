import {createSelector} from '@reduxjs/toolkit';
import {selectCommentById} from '../reducers/CommentSlice';
import {selectUserById} from '../reducers/UserSlice';

export const getParentComments = (postId) => (state) =>
  state.comments.posts[postId] === undefined
    ? []
    : state.comments.posts[postId].parentComments;

export const isLoading = (postId) => (state) =>
  state.comments.posts[postId] === undefined
    ? false
    : state.comments.posts[postId].loading;

export const selectFlatCommentById = (id) => {
  return createSelector(
    (state) => {
      return {comment: selectCommentById(state, id), state: state};
    },
    ({comment, state}) => {
      const author = selectUserById(state, comment.author);
      const flatComment = {...comment, author: author};
      return flatComment;
    },
  );
};
