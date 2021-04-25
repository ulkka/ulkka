import {createSlice} from '@reduxjs/toolkit';
import {fetchFeed} from '../actions/FeedActions';
import {createReply} from './CommentWriterSlice';
import {
  votePost,
  createPost,
  deletePost,
  fetchPostById,
  reportPost,
} from '../actions/PostActions';
import {postAdapter} from '../selectors/PostSelectors';
import Snackbar from 'react-native-snackbar';
import {handleError} from '../actions/common';
import analytics from '@react-native-firebase/analytics';

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
      newPost.userVote = newPost.userVote ? newPost.userVote : 1;
      postAdapter.addOne(state, newPost);
      analytics().logEvent('post_create', {post_type: newPost.type});
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
          postAdapter.upsertMany(state, posts);
        }
      }
    },
    [fetchPostById.fulfilled]: (state, action) => {
      const {posts, postId} = action.payload;
      postAdapter.upsertOne(state, posts[postId]);
    },
    [deletePost.fulfilled]: (state, action) => {
      const postId = action.payload;
      postAdapter.removeOne(state, postId);
      Snackbar.show({
        text: 'Post deleted',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('post_delete');
    },
    [votePost.fulfilled]: (state, action) => {
      const postId = action.payload?.data?._id;

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
      analytics().logEvent('post_vote', {
        type: newUserVote,
        post_type: post.type,
      });
    },
    [votePost.rejected]: handleError,
    [reportPost.rejected]: handleError,
    [fetchPostById.rejected]: handleError,
    [createPost.rejected]: handleError,
    [deletePost.rejected]: handleError,
  },
});
export const posts = slice.reducer;
