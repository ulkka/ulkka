import {createSelector} from '@reduxjs/toolkit';
import {selectCommentById} from '../reducers/CommentSlice';
import {selectUserEntities} from '../reducers/UserSlice';
import {createSelectorCreator, defaultMemoize} from 'reselect';

export const getParentCommentIdsSelector = () => (state, postId) =>
  state.comments.posts[postId]?.parentCommenIds;

export const isLoadingSelector = () => (state, postId) =>
  state.comments.posts[postId]?.loading;

export const getCommentUserVoteSelector = () => {
  return createSelector(selectCommentById, (comment) => comment.userVote);
};

export const getCommentVoteCountSelector = () => {
  return createSelector(selectCommentById, (comment) => comment.voteCount);
};

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

const getFlatCommentByIdSelector = () => {
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

export const memoizedGetFlatCommentByIdSelector = () =>
  createCommentByIdEqualitySelector(
    getFlatCommentByIdSelector(),
    (comment) => comment,
  );
