import {fetchFeed} from '../actions/FeedActions';
import {fetchComments} from '../actions/CommentActions';
import {createReply} from './ReplySlice';
import {createPost} from '../actions/PostActions';
import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

export const userAdapter = createEntityAdapter({
  selectId: (user) => user._id,
});

export const slice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [createPost.fulfilled]: (state, action) => {
      const newPostId = action.payload.newPostId;
      const newPost = action.payload.normalizedPost.posts[newPostId];
      const newUserId = newPost.author;
      const newUser = action.payload.normalizedPost.users[newUserId];
      userAdapter.upsertOne(state, newUser);
    },
    [fetchFeed.fulfilled]: (state, action) => {
      const normalizedPosts = action.payload.normalizedPosts;

      const isFeedEmpty =
        normalizedPosts &&
        Object.keys(normalizedPosts).length === 0 &&
        normalizedPosts.constructor === Object;

      if (!isFeedEmpty) {
        userAdapter.upsertMany(state, action.payload.normalizedPosts.users);
      }
    },
    [fetchComments.fulfilled]: (state, action) => {
      if (action.payload.normalizedComments.users !== undefined) {
        userAdapter.upsertMany(state, action.payload.normalizedComments.users);
      }
    },
    [createReply.fulfilled]: (state, action) => {
      const newCommentId = action.payload.result;
      const newComment =
        action.payload.normalizedComment.comments[newCommentId];
      const newCommentAuthorId = newComment.author;
      const newCommentAuthor =
        action.payload.normalizedComment.users[newCommentAuthorId];
      userAdapter.upsertOne(state, newCommentAuthor);
    },
  },
});

export const users = slice.reducer;

export const {
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectTotalUsers,
} = userAdapter.getSelectors((state) => state.users);
