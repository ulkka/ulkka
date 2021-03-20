import {createSelector} from '@reduxjs/toolkit';
import {selectUserEntities} from '../reducers/UserSlice';
import {selectCommunityEntities} from '../reducers/CommunitySlice';
import {selectPostById, selectAllPosts} from '../reducers/PostSlice';
import {getFeedPostIds} from './FeedSelectors';
import {createSelectorCreator, defaultMemoize} from 'reselect';

//  https://github.com/reduxjs/reselect#accessing-react-props-in-selectors
//  https://github.com/reduxjs/reselect#customize-equalitycheck-for-defaultmemoize
//  return true if length of prev and next array is same
//  this might support when multiple feeds are enabled, but if some issue, investigate here

export const getPostUserVoteSelector = () => {
  return createSelector(selectPostById, (post) => post.userVote);
};

export const getPostVoteCountSelector = () => {
  return createSelector(selectPostById, (post) => post.voteCount);
};

export const getPostCommentCountSelector = () => {
  return createSelector(selectPostById, (post) => post.commentCount);
};

// return true so post will remain same so post detail wont refresh after new comment/reply added
const createPostByIdEqualitySelector = createSelectorCreator(
  defaultMemoize,
  () => {
    return true;
  },
);

const memoizedFlatPostById = () =>
  createPostByIdEqualitySelector(selectPostById, (post) => post);

const getFlatPostByIdSelector = () => {
  return createSelector(
    [memoizedFlatPostById(), selectCommunityEntities, selectUserEntities],
    (post, communityEnitities, userEntities) => {
      return {
        ...post,
        communityDetail: communityEnitities[post.community],
        authorDetail: userEntities[post.author],
      };
    },
  );
};
export const memoizedGetFlatPostByIdSelector = () =>
  createPostByIdEqualitySelector(getFlatPostByIdSelector(), (post) => post);

//  https://github.com/reduxjs/reselect#accessing-react-props-in-selectors
//  https://github.com/reduxjs/reselect#customize-equalitycheck-for-defaultmemoize
//  return true if length of prev and next array is same
//  might need update while working with multuple feeds- watch out!

const createAllPostsEqualitySelector = createSelectorCreator(
  defaultMemoize,
  (a, b) => {
    return a.length == b.length;
  },
);

const memoizedSelectAllPosts = () =>
  createAllPostsEqualitySelector(selectAllPosts, (posts) => posts);

const getFlatPostsSelector = () => {
  return createSelector(
    [
      getFeedPostIds(),
      memoizedSelectAllPosts(), //this will change only if length of array changes
      selectCommunityEntities,
      selectUserEntities,
    ],
    (postIds, allPosts, communityEnitities, userEntities) => {
      return allPosts
        .filter((post) => postIds?.includes(post._id))
        .map((post) => {
          return {
            ...post,
            communityDetail: communityEnitities[post.community],
            authorDetail: userEntities[post.author],
          };
        })
        .sort((a, b) => postIds.indexOf(a._id) - postIds.indexOf(b._id)); // to sort according to order of Ids in feed IDs array
    },
  );
};

//this will change only if length of array changes, to support memoization of multiple feeds
export const memoizedSelectAllFlatPosts = () =>
  createAllPostsEqualitySelector(getFlatPostsSelector(), (posts) => posts);
