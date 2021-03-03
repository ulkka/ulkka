import {comment} from '../schema/CommentSchema';
import postApi from '../../services/PostApi';
import {normalize} from 'normalizr';
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
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
      topLevelCommentIds: normalized.result,
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
    topLevelCommentIds: [],
  },
  reducers: {},
  extraReducers: {
    [fetchComments.pending]: (state, action) => {
      state.loading = true;
      commentAdapter.removeAll(state);
      state.topLevelCommentIds = [];
    },
    [fetchComments.fulfilled]: (state, action) => {
      if (action.payload.normalizedComments.comments !== undefined) {
        commentAdapter.upsertMany(
          state,
          action.payload.normalizedComments.comments,
        );
      }
      state.topLevelCommentIds = action.payload.topLevelCommentIds;
      state.loading = false;
    },
    [createReply.fulfilled]: (state, action) => {
      console.log('normalized comments', action.payload);
      const newCommentId = action.payload.result;
      const newComment =
        action.payload.normalizedComment.comments[newCommentId];
      newComment.userVote = 0;
      commentAdapter.addOne(state, newComment);
      if (newComment.parent === undefined) {
        state.topLevelCommentIds.push(newComment._id);
      } else {
        if (state.entities[newComment.parent].replies === undefined) {
          state.entities[newComment.parent].replies = [];
        }
        state.entities[newComment.parent].replies.push(newComment._id);
      }
    },

    [voteComment.fulfilled]: (state, action) => {
      const id = action.payload.data._id;
      const comment = state.entities[id];
      const currentVote = comment.userVote;
      const newVote = action.payload.data.userVote;
      const diff = currentVote - newVote;
      state.entities[id].userVote = newVote;
      state.entities[id].voteCount = state.entities[id].voteCount - diff;
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

export const isLoading = (state) => state.comments.loading;
