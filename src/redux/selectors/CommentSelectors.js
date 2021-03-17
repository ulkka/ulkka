import {createSelector} from '@reduxjs/toolkit';
import {selectCommentById, selectAllComments} from '../reducers/CommentSlice';
import {selectUserEntities} from '../reducers/UserSlice';

export const getParentComments = (state, postId) =>
  state.comments.posts[postId] === undefined
    ? []
    : state.comments.posts[postId].parentCommenIds;

export const isLoading = (state, postId) =>
  state.comments.posts[postId] === undefined
    ? false
    : state.comments.posts[postId].loading;

export const getCommentField = (state, id, field) =>
  selectCommentById(state, id)[field];

// return the selector so that each comment thread would have different selectors
// and memoize can work properly https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances
export const selectFlatCommentByIdSelector = () => {
  return createSelector(
    [selectCommentById, selectUserEntities],
    (comment, userEntities) => {
      const flatComment = {
        ...comment,
        authorDetail: userEntities[comment.author],
      };
      return flatComment;
    },
  );
};

export const selectFlatComments = createSelector(
  [getParentComments, selectAllComments, selectUserEntities],
  (parentCommentIds, allComments, userEntities) => {
    return allComments
      .filter((comment) => parentCommentIds.includes(comment._id))
      .map((comment) => {
        return {
          ...comment,
          authorDetail: userEntities[comment.author],
        };
      });
  },
);
