import {createSlice} from '@reduxjs/toolkit';
import {fetchFeed} from '../actions/FeedActions';
import {createReply} from './CommentWriterSlice';
import {
  votePost,
  createPost,
  deletePost,
  fetchPostById,
} from '../actions/PostActions';
import {postAdapter} from '../selectors/PostSelectors';
import Snackbar from 'react-native-snackbar';

export const slice = createSlice({
  name: 'posts',
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {},
  extraReducers: {
    [createPost.fulfilled]: (state, action) => {
      const newPostId = action.payload.newPostId;
      const newPost = action.payload.normalizedPost.posts[newPostId];
      newPost.userVote = 0;
      postAdapter.addOne(state, newPost);
    },
    [createReply.fulfilled]: (state, action) => {
      const postId = action.payload.data.postId;
      const post = postAdapter.getSelectors().selectById(state, postId);
      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          commentCount: post.commentCount + 1,
        },
      });
    },
    [fetchFeed.fulfilled]: (state, action) => {
      if (action.payload.normalizedPosts !== undefined) {
        const normalizedPosts = action.payload.normalizedPosts;

        const isFeedEmpty =
          normalizedPosts &&
          Object.keys(normalizedPosts).length === 0 &&
          normalizedPosts.constructor === Object;

        if (!isFeedEmpty) {
          const posts = normalizedPosts.posts;
          postAdapter.addMany(state, posts);
        }
      }
    },
    [fetchPostById.fulfilled]: (state, action) => {
      const {posts, postId} = action.payload;
      postAdapter.upsertOne(state, posts[postId]);
    },
    [deletePost.fulfilled]: (state, action) => {
      const postId = action.payload;
      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          status: 'deleted',
        },
      });
      Snackbar.show({
        text: 'Post deleted',
        duration: Snackbar.LENGTH_SHORT,
      });
    },
    [votePost.fulfilled]: (state, action) => {
      const postId = action.payload.data._id;
      const post = postAdapter.getSelectors().selectById(state, postId);

      const currentUserVote = post.userVote ? post.userVote : 0; // handling undefined userVote
      const newUserVote = action.payload.data.userVote;
      const diff = currentUserVote - newUserVote;
      const newVoteCount = post.voteCount - diff;

      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          userVote: newUserVote,
          voteCount: newVoteCount,
        },
      });
    },
  },
});
export const posts = slice.reducer;
