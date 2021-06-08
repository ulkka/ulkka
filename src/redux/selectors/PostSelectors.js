import {createEntityAdapter} from '@reduxjs/toolkit';
import {selectUserById} from '../reducers/UserSlice';
import {selectCommunityById} from '../reducers/CommunitySlice';
import {createCachedSelector} from 're-reselect';

//  https://github.com/reduxjs/reselect#accessing-react-props-in-selectors
//  https://github.com/reduxjs/reselect#customize-equalitycheck-for-defaultmemoize
//  return true if length of prev and next array is same
//  this might support when multiple feeds are enabled, but if some issue, investigate here
export const postAdapter = createEntityAdapter({selectId: (post) => post._id});

export const {
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
  selectAll: selectAllPosts,
  selectTotal: selectTotalPosts,
} = postAdapter.getSelectors((state) => state.posts);

export const getPostUserVote = (state, id) =>
  selectPostById(state, id)?.userVote;

export const getPostVoteCount = (state, id) =>
  selectPostById(state, id)?.voteCount;

export const getPostCommentCount = (state, id) =>
  selectPostById(state, id)?.commentCount;

export const getPostTitle = (state, id) => selectPostById(state, id)?.title;

export const getPostDescription = (state, id) =>
  selectPostById(state, id)?.description;

export const getPostLink = (state, id) => selectPostById(state, id)?.link;

export const getPostMediaMetadata = (state, id) =>
  selectPostById(state, id)?.mediaMetadata;

export const getPostOgData = (state, id) => selectPostById(state, id)?.ogData;

export const getPostType = (state, id) => selectPostById(state, id)?.type;

export const getPostCreatedAt = (state, id) =>
  selectPostById(state, id)?.created_at;

export const getPostStatus = (state, id) => selectPostById(state, id)?.status;

export const getPostisDeleted = (state, id) =>
  selectPostById(state, id)?.isDeleted;

export const getPostisRemoved = (state, id) =>
  selectPostById(state, id)?.isRemoved;

export const getPostMediaIsDownloading = (state, id) =>
  selectPostById(state, id)?.isDownloading;

export const getPostMediaIsDownloaded = (state, id) =>
  selectPostById(state, id)?.downloaded;

export const getPostMediaLocalUri = (state, id) =>
  selectPostById(state, id)?.localUri;

export const getPostIsMediaError = (state, id) =>
  selectPostById(state, id)?.mediaError;

export const getPostMediaRefreshCount = (state, id) =>
  selectPostById(state, id)?.refreshCount;

export const getPostAuthorId = (state, id) => selectPostById(state, id)?.author;

export const getPostCommunityId = (state, id) =>
  selectPostById(state, id)?.community;

export const getPostIsPinned = (state, id) =>
  selectPostById(state, id)?.isPinned;

export const getPostAuthorDisplayname = createCachedSelector(
  (state) => state,
  getPostAuthorId,
  (state, authorId) => selectUserById(state, authorId)?.displayname,
)((state, id) => id);

export const getPostCommunityName = createCachedSelector(
  (state) => state,
  getPostCommunityId,
  (state, communityId) =>
    communityId && selectCommunityById(state, communityId)?.name,
)((state, id) => id);
