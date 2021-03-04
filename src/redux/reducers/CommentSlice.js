import {comment} from '../schema/CommentSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import {createReply} from './ReplySlice';

const commentAdapter = createEntityAdapter({
  selectId: (comment) => comment._id,
});

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (post_id) => {
    let response = await postApi.comment.fetch(post_id);
    const normalized = normalize(response.data, [comment]);
    return {
      normalizedComments: normalized.entities,
    };
  },
);

export const voteComment = createAsyncThunk(
  'comments/vote',
  async ({id, voteType}) => {
    let response = await postApi.comment.vote(id, voteType);
    return response;
  },
  {
    condition: ({id, voteType}, {getState}) => {
      const authStatus = getState().authorization.status;
      const access = authStatus == 'AUTHENTICATED' ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

export const slice = createSlice({
  name: 'comments',
  initialState: {
    loading: true,
    ids: [],
    entities: {},
  },
  reducers: {},
  extraReducers: {
    [fetchComments.pending]: (state, action) => {
      state.loading = true;
      commentAdapter.removeAll(state);
    },
    [fetchComments.fulfilled]: (state, action) => {
      if (action.payload.normalizedComments.comments !== undefined) {
        commentAdapter.upsertMany(
          state,
          action.payload.normalizedComments.comments,
        );
      }
      state.loading = false;
    },
    [createReply.fulfilled]: (state, action) => {
      const newCommentId = action.payload.result;
      const parentCommentId = action.payload.data.parentCommentId;
      const newComment =
        action.payload.normalizedComment.comments[newCommentId];
      newComment.userVote = 0;

      commentAdapter.addOne(state, newComment);

      if (parentCommentId !== undefined) {
        const parentComment = commentAdapter
          .getSelectors()
          .selectById(state, parentCommentId);

        const newReplyList =
          parentComment.replies === undefined
            ? [newCommentId]
            : [...parentComment.replies, ...[newCommentId]];

        commentAdapter.updateOne(state, {
          id: parentCommentId,
          changes: {
            replies: newReplyList,
          },
        });
      }
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

export const getCommentUserVote = createSelector(
  selectCommentById,
  (item) => item.userVote,
);

export const getCommentVoteCount = createSelector(
  selectCommentById,
  (item) => item.voteCount,
);

export const getCommentReplies = createSelector(
  selectCommentById,
  (item) => item.replies,
);

export const getCommentParent = createSelector(
  selectCommentById,
  (item) => item.parent,
);

export const isLoading = (state) => state.comments.loading;
