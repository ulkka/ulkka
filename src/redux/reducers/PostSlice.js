import {createSlice} from '@reduxjs/toolkit';
import {fetchFeed} from '../actions/FeedActions';
import {createReply} from './CommentWriterSlice';
import {
  votePost,
  createPost,
  deletePost,
  fetchPostById,
  reportPost,
  downloadMedia,
  removePost,
  downloadMediaToLibrary,
  pinPost,
  unpinPost,
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
    [removePost.fulfilled]: (state, action) => {
      const postId = action.payload;
      postAdapter.removeOne(state, postId);
      Snackbar.show({
        text: 'Post removed',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('post_remove');
    },
    [votePost.pending]: (state, action) => {
      const {id: postId, voteType: newUserVote} = action.meta.arg;

      const post = postAdapter.getSelectors().selectById(state, postId);
      const currentUserVote = post.userVote ? post.userVote : 0; // handling undefined userVote
      const diff = currentUserVote - newUserVote;
      const newVoteCount = post.voteCount - diff;

      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          userVote: newUserVote,
          voteCount: newVoteCount,
          voteIsLoading: true,
          pastUserVote: currentUserVote,
          pastVoteCount: post.voteCount,
        },
      });
    },
    [votePost.fulfilled]: (state, action) => {
      const postId = action.payload?.data?._id;

      const post = postAdapter.getSelectors().selectById(state, postId);

      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          voteIsLoading: false,
        },
      });

      const newUserVote = action.payload.data.userVote;

      analytics().logEvent('post_vote', {
        type: newUserVote,
        post_type: post.type,
      });
    },
    [reportPost.fulfilled]: (state, action) => {
      const {id: postId, option: selectedReportOption} = action.payload;
      postAdapter.removeOne(state, postId);
      Snackbar.show({
        text: 'Thanks for reporting',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('content_report', {
        item_id: postId,
        type: 'post',
        reason: selectedReportOption,
      });
    },
    [downloadMedia.pending]: (state, action) => {
      const postId = action.meta.arg;
      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          isDownloading: true,
          mediaError: false,
        },
      });
    },
    [downloadMedia.fulfilled]: (state, action) => {
      const {postId, localUri} = action.payload;
      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          isDownloading: false,
          localUri: localUri,
          downloaded: true,
          mediaError: false,
        },
      });
    },
    [downloadMedia.rejected]: (state, action) => {
      const postId = action.meta.arg;
      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          isDownloading: false,
          mediaError: true,
        },
      });
    },
    [downloadMediaToLibrary.fulfilled]: (state, action) => {
      const postId = action.payload;
      Snackbar.show({
        text: 'File saved to Library',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('media_download', {
        item_id: postId,
      });
    },
    [pinPost.fulfilled]: (state, action) => {
      const postId = action.payload;
      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          isPinned: true,
        },
      });
      Snackbar.show({
        text: 'Post Pinned',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('post_pin');
    },
    [unpinPost.fulfilled]: (state, action) => {
      const postId = action.payload;
      postAdapter.updateOne(state, {
        id: postId,
        changes: {
          isPinned: false,
        },
      });
      Snackbar.show({
        text: 'Post Unpinned',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('post_unpin');
    },
    [votePost.rejected]: (state, action) => {
      const {name: errorName} = action.error;
      if (errorName == 'RejectWithValue') {
        const {id: postId} = action.meta.arg;
        const post = postAdapter.getSelectors().selectById(state, postId);

        const {pastUserVote, pastVoteCount} = post; // handling undefined userVote
        postAdapter.updateOne(state, {
          id: postId,
          changes: {
            userVote: pastUserVote ? pastUserVote : 0,
            voteCount: pastVoteCount,
            voteIsLoading: false,
          },
        });
      }

      handleError(state, action);
    },
    [reportPost.rejected]: handleError,
    [fetchPostById.rejected]: handleError,
    [createPost.rejected]: handleError,
    [deletePost.rejected]: handleError,
  },
});
export const posts = slice.reducer;
