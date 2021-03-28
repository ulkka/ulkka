import {createEntityAdapter} from '@reduxjs/toolkit';
import {selectUserById} from '../reducers/UserSlice';
import createCachedSelector from 're-reselect';
import {selectPostById} from './PostSelectors';

export const commentAdapter = createEntityAdapter({
  selectId: (comment) => comment._id,
});

export const {
  selectById: selectCommentById,
  selectIds: selectCommentIds,
  selectEntities: selectCommentEntities,
  selectAll: selectAllComments,
  selectTotal: selectTotalComments,
} = commentAdapter.getSelectors((state) => state.comments);

export const getParentCommentIdsOfPost = (state, postId) =>
  state.comments.posts[postId]?.parentCommentIds;

export const isLoadingSelector = () => (state, postId) =>
  state.comments.posts[postId]?.loading;

export const areCommentsLoading = (state, postId) =>
  state.comments.posts[postId]?.loading;

export const getCommentUserVote = (state, id) =>
  selectCommentById(state, id)?.userVote;

export const getCommentVoteCount = (state, id) =>
  selectCommentById(state, id)?.voteCount;

export const getCommentCreatedAt = (state, id) =>
  selectCommentById(state, id)?.created_at;

export const getCommentText = (state, id) => selectCommentById(state, id)?.text;

export const getCommentStatus = (state, id) =>
  selectCommentById(state, id)?.status;

export const getCommentReplies = (state, id) =>
  selectCommentById(state, id)?.replies;

export const getCommentPostId = (state, id) =>
  selectCommentById(state, id)?.post;

export const getCommentPostAuthor = createCachedSelector(
  (state) => state,
  getCommentPostId,
  (state, postId) => selectPostById(state, postId)?.author,
)((state, id) => id);

export const getCommentAuthorId = (state, id) =>
  selectCommentById(state, id)?.author;

export const getCommentAuthorDisplayname = createCachedSelector(
  (state) => state,
  getCommentAuthorId,
  (state, authorId) => selectUserById(state, authorId)?.displayname,
)((state, id) => id);

export const getUserCommentsSelector = (state, userId) =>
  state.comments.users[userId]?.parentCommentIds;
