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
    },
    [fetchComments.fulfilled]: (state, action) => {
      commentAdapter.upsertMany(
        state,
        action.payload.normalizedComments.comments,
      );
      state.topLevelCommentIds = action.payload.topLevelCommentIds;
      state.loading = false;
    },
    [createReply.fulfilled]: (state, action) => {
      var comment = action.payload.response.data;
      console.log('after comment response in reply slice - ', comment, state);
      comment.userVote = 0;
      commentAdapter.addOne(state, comment);
      if (comment.parent === undefined) {
        state.topLevelCommentIds.push(comment._id);
      } else {
        if (state.entities[comment.parent].replies === undefined) {
          state.entities[comment.parent].replies = [];
        }
        state.entities[comment.parent].replies.push(comment._id);
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
