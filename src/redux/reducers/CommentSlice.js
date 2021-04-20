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
  fetchUserComments,
} from '../actions/CommentActions';
import {handleError} from '../actions/common';
import analytics from '@react-native-firebase/analytics';

const initialStatePostComments = {
  loading: true,
  parentCommentIds: [],
  refreshing: false,
};

const initialStateUserComments = {
  loading: false,
  commentIds: [],
  metadata: {
    page: 0,
    total: -1,
    limit: 10,
  },
  complete: false,
  refreshing: false,
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
      const postId = action.meta.arg;

      const commentState = state.posts[postId];
      if (!commentState) {
        state.posts[postId] = initialStatePostComments;
      }
    },
    [fetchComments.fulfilled]: (state, action) => {
      const comments = action.payload.normalizedComments.comments;

      const postId = action.meta.arg;
      const commentState = state.posts[postId];

      if (comments) {
        commentAdapter.upsertMany(state, comments);
      }

      commentState.parentCommentIds = action.payload.parentComments;
      commentState.loading = false;
    },
    [fetchUserComments.pending]: (state, action) => {
      const userId = action.meta.arg;

      const commentState = state.users[userId];
      if (!commentState) {
        state.users[userId] = initialStateUserComments;
      }
    },
    [fetchUserComments.fulfilled]: (state, action) => {
      const comments = action.payload.normalizedComments?.comments;

      const userId = action.meta.arg;
      const commentState = state.users[userId];

      const page = action.payload?.metadata?.page;
      const total = page && action.payload.metadata.total;
      const limit = page && action.payload.metadata.limit;
      const isComplete = total <= limit * page;

      if (comments) {
        commentAdapter.upsertMany(state, comments);
        commentState.metadata = action.payload.metadata;
        commentState.commentIds = [
          ...commentState.commentIds,
          ...action.payload.commentIds,
        ];

        commentState.complete = isComplete;
        isComplete &&
          analytics().logEvent('usercomments_complete', {
            page: page,
            total: total,
          });
      } else {
        commentState.complete = true;
      }

      commentState.loading = false;
      commentState.refreshing = false;
      analytics().logEvent('usercomments_fetch', {page: page});
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
      analytics().logEvent('comment_create', {
        type: type,
        comment_level: newComment.level,
      });
    },
    [deleteComment.fulfilled]: (state, action) => {
      const commentId = action.payload;
      commentAdapter.updateOne(state, {
        id: commentId,
        changes: {
          isDeleted: true,
        },
      });
      Snackbar.show({
        text: 'Comment deleted',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('comment_delete');
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
      analytics().logEvent('comment_vote', {
        type: newUserVote,
      });
    },
    [refreshComments.pending]: (state, action) => {
      const postId = action.meta.arg;
      const screen = state.posts[postId];
      screen.refreshing = true;
    },
    [refreshComments.fulfilled]: (state, action) => {
      const postId = action.payload;
      const screen = state.posts[postId];
      screen.refreshing = false;
      analytics().logEvent('comment_refresh');
    },
    [voteComment.rejected]: handleError,
    [reportComment.rejected]: handleError,
    [fetchComments.rejected]: (state, action) => {
      const {name: errorName} = action.error;
      errorName != 'ConditionError' && handleError(state, action);
    },
    [fetchUserComments.rejected]: (state, action) => {
      const userId = action.meta.arg;
      const commentState = state.users[userId];
      commentState.loading = false;
      const {name: errorName} = action.error;
      errorName != 'ConditionError' && handleError(state, action);
    },
    [deleteComment.rejected]: handleError,
    [refreshComments.rejected]: handleError,
  },
});

export const comments = slice.reducer;
