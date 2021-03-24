import {selectUserById} from '../reducers/UserSlice';
import {selectCommunityById} from '../reducers/CommunitySlice';
import {selectPostById} from '../reducers/PostSlice';
import {createCachedSelector} from 're-reselect';

//  https://github.com/reduxjs/reselect#accessing-react-props-in-selectors
//  https://github.com/reduxjs/reselect#customize-equalitycheck-for-defaultmemoize
//  return true if length of prev and next array is same
//  this might support when multiple feeds are enabled, but if some issue, investigate here

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

export const getPostAuthorId = (state, id) => selectPostById(state, id)?.author;

export const getPostCommunityId = (state, id) =>
  selectPostById(state, id)?.community;

export const getPostAuthorDisplayname = createCachedSelector(
  (state) => state,
  getPostAuthorId,
  (state, authorId) => selectUserById(state, authorId)?.displayname,
)((state, id) => id);

export const getPostCommunityName = createCachedSelector(
  (state) => state,
  getPostCommunityId,
  (state, communityId) => selectCommunityById(state, communityId)?.name,
)((state, id) => id);
