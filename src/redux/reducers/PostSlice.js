import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import {fetchFeed} from '../actions/FeedActions';
import {createReply} from './ReplySlice';
import {signout, socialAuth} from '../actions/AuthActions';
import {votePost, createPost, deletePost} from '../actions/PostActions';
import Snackbar from 'react-native-snackbar';

const postAdapter = createEntityAdapter({selectId: (post) => post._id});

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
    [signout.fulfilled]: (state) => {
      //resetAllFeeds(state);
    },
    // [registerUser.fulfilled]: () => postAdapter.getInitialState(),
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

export const {
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
  selectAll: selectAllPosts,
  selectTotal: selectTotalPosts,
} = postAdapter.getSelectors((state) => state.posts);
