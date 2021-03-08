import {comment} from '../schema/CommentSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {createReply} from './ReplySlice';
import Snackbar from 'react-native-snackbar';

const commentAdapter = createEntityAdapter({
  selectId: (comment) => comment._id,
});

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId) => {
    let response = await postApi.comment.fetch(postId);
    const normalized = normalize(response.data, [comment]);
    return {
      normalizedComments: normalized.entities,
      parentComments: normalized.result,
    };
  },
  {
    condition: (postId, {getState}) => {
      const authStatus = getState().authorization.status;
      const authAccess = authStatus == 'UNAUTHENTICATED' ? false : true;

      const postComments = getState().comments.posts[postId];
      const requestAccess =
        postComments === undefined ? true : !postComments.loading;

      return authAccess && requestAccess;
    },
    dispatchConditionRejection: true,
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

const initialState = {
  loading: true,
  parentComments: [],
};

export const slice = createSlice({
  name: 'comments',
  initialState: {
    loading: false,
    ids: [],
    entities: {},
    parentComments: [],
    posts: {},
  },
  reducers: {},
  extraReducers: {
    [fetchComments.pending]: (state, action) => {
      const postId = action.meta.arg;
      state.loading = true;
      const postComments = state.posts[postId];
      if (postComments === undefined) {
        state.posts[postId] = initialState;
      }
    },
    [fetchComments.fulfilled]: (state, action) => {
      const comments = action.payload.normalizedComments.comments;
      const postId = action.meta.arg;
      const postComments = state.posts[postId];

      if (comments !== undefined) {
        commentAdapter.upsertMany(state, comments);
      }
      postComments.parentComments = action.payload.parentComments;
      postComments.loading = false;
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
      } else {
        state.posts[postId].parentComments.unshift(newCommentId);
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
