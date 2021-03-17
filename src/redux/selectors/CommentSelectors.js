import {createSelector} from '@reduxjs/toolkit';
import {selectCommentById, selectAllComments} from '../reducers/CommentSlice';
import {selectUserEntities} from '../reducers/UserSlice';
import {createSelectorCreator, defaultMemoize} from 'reselect';

export const getParentCommentIds = (state, postId) =>
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
const createCommentByIdEqualitySelector = createSelectorCreator(
  defaultMemoize,
  (a, b) => {
    return a.replies.length == b.replies.length;
  },
);

const memoizedSelectCommentById = () =>
  createCommentByIdEqualitySelector(selectCommentById, (comment) => comment);

export const getFlatCommentByIdSelector = () => {
  return createSelector(
    [memoizedSelectCommentById(), selectUserEntities],
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
  [getParentCommentIds, selectAllComments, selectUserEntities],
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
