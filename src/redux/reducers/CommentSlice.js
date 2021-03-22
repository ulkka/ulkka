import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import {createReply} from './ReplySlice';
import Snackbar from 'react-native-snackbar';
import {fetchComments, voteComment} from '../actions/CommentActions';

const commentAdapter = createEntityAdapter({
  selectId: (comment) => comment._id,
});

const initialStatePostComments = {
  loading: true,
  parentCommentIds: [],
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
        commentAdapter.upsertMany(state, comments);
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

    [voteComment.fulfilled]: (state, action) => {
      const id = action.payload.data._id;
      const comment = state.entities[id];
      const currentUserVote = comment.userVote;
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
  },
});

export const comments = slice.reducer;

export const {
  selectById: selectCommentById,
  selectIds: selectCommentIds,
  selectEntities: selectCommentEntities,
  selectAll: selectAllComments,
  selectTotal: selectTotalComments,
} = commentAdapter.getSelectors((state) => state.comments);
