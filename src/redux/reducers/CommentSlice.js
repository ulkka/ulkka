import {createSlice} from '@reduxjs/toolkit';
import {commentAdapter} from '../selectors/CommentSelectors';
import {createReply} from './CommentWriterSlice';
import Snackbar from 'react-native-snackbar';
import {
  deleteComment,
  fetchComments,
  voteComment,
  refreshComments,
  reportComment,
} from '../actions/CommentActions';
import {handleError} from '../actions/common';

const initialStatePostComments = {
  loading: true,
  parentCommentIds: [],
  refreshing: false,
};

const initialStateUserComments = {
  loading: true,
  commentIds: [],
};

function addReply(state, parentCommentId, newCommentId) {
  const parentComment = commentAdapter
    .getSelectors()
    .selectById(state, parentCommentId);

  const newReplyList =
    parentComment.replies === undefined
      ? [newCommentId]
      : [...[newCommentId], ...parentComment.replies];

  commentAdapter.updateOne(state, {
    id: parentCommentId,
    changes: {
      replies: newReplyList,
    },
  });
}

export const slice = createSlice({
  name: 'comments',
  initialState: {
    ids: [],
    entities: {},
    posts: {},
    users: {},
  },
  reducers: {},
  extraReducers: {
    [fetchComments.pending]: (state, action) => {
      const {postId, userId} = action.meta.arg;
      const entity = postId ? 'posts' : 'users';
      const entityId = entity == 'posts' ? postId : userId;

      const commentState = state[entity][entityId];
      if (!commentState) {
        state[entity][entityId] = initialStatePostComments;
      }
    },
    [fetchComments.fulfilled]: (state, action) => {
      const comments = action.payload.normalizedComments.comments;

      const {postId, userId} = action.meta.arg;
      const entity = postId ? 'posts' : 'users';
      const entityId = entity == 'posts' ? postId : userId;

      const commentState = state[entity][entityId];

      if (comments) {
        entity == 'posts'
          ? commentAdapter.addMany(state, comments)
          : commentAdapter.upsertMany(state, comments);
      }

      commentState.parentCommentIds = action.payload.parentComments;
      commentState.loading = false;
    },
    [createReply.fulfilled]: (state, action) => {
      const newCommentId = action.payload.result;
      const parentCommentId = action.payload.data.parentCommentId;

      const type = parentCommentId === undefined ? 'Comment' : 'Reply';
      const newComment =
        action.payload.normalizedComment.comments[newCommentId];
      newComment.userVote = 0;

      const postId = newComment.post;

      commentAdapter.addOne(state, newComment);

      if (type == 'Reply') {
        addReply(state, parentCommentId, newCommentId);
      } else {
        state.posts[postId].parentCommentIds.unshift(newCommentId);
      }

      Snackbar.show({
        text: type + ' Added',
        duration: Snackbar.LENGTH_SHORT,
      });
    },
    [deleteComment.fulfilled]: (state, action) => {
      const commentId = action.payload;

      const comment = commentAdapter
        .getSelectors()
        .selectById(state, commentId);
      commentAdapter.upsertOne(state, {...comment, status: 'deleted'});
      /*commentAdapter.updateOne(state, {
        id: commentId,
        changes: {
          status: 'deleted',
        },
      });*/
      Snackbar.show({
        text: 'Comment deleted',
        duration: Snackbar.LENGTH_SHORT,
      });
    },
    [voteComment.fulfilled]: (state, action) => {
      const id = action.payload.data._id;
      const comment = state.entities[id];
      const currentUserVote = comment.userVote ? comment.userVote : 0; // handling undefined userVote
      const newUserVote = action.payload.data.userVote;
      const diff = currentUserVote - newUserVote;
      const newVoteCount = state.entities[id].voteCount - diff;
      commentAdapter.updateOne(state, {
        id: id,
        changes: {
          userVote: newUserVote,
          voteCount: newVoteCount,
        },
      });
    },
    [voteComment.rejected]: handleError,
    [refreshComments.pending]: (state, action) => {
      const postId = action.meta.arg;
      const screen = state.posts[postId];
      screen.refreshing = true;
    },
    [refreshComments.fulfilled]: (state, action) => {
      const postId = action.payload;
      const screen = state.posts[postId];
      screen.refreshing = false;
    },
    [reportComment.rejected]: handleError,
  },
});

export const comments = slice.reducer;
