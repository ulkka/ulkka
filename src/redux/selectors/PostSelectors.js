import {createSelector} from '@reduxjs/toolkit';
import {selectUserEntities} from '../reducers/UserSlice';
import {selectCommunityEntities} from '../reducers/CommunitySlice';
import {selectPostById, selectAllPosts} from '../reducers/PostSlice';
import {getFeedPostIds} from './FeedSelectors';
import {createSelectorCreator, defaultMemoize} from 'reselect';

export const getPostField = (state, id, field) =>
  selectPostById(state, id)[field];

export const selectFlatPostById = createSelector(
  [selectPostById, selectCommunityEntities, selectUserEntities],
  (post, communityEnitities, userEntities) => {
    return {
      ...post,
      communityDetail: communityEnitities[post.community],
      authorDetail: userEntities[post.author],
    };
  },
);

//  refactor https://github.com/reduxjs/reselect#accessing-react-props-in-selectors
//  https://github.com/reduxjs/reselect#customize-equalitycheck-for-defaultmemoize
//  return true if length of prev and next array is same
//  might need update while working with multuple feeds- watch out!

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  (a, b) => {
    return a.length == b.length;
  },
);

const memoizedSelectAllPosts = createDeepEqualSelector(
  selectAllPosts,
  (posts) => posts,
);

export const selectFlatPosts = createSelector(
  [
    getFeedPostIds,
    memoizedSelectAllPosts, //this will change only if length of array changes
    selectCommunityEntities,
    selectUserEntities,
  ],
  (postIds, allPosts, communityEnitities, userEntities) => {
    return allPosts
      .filter((post) => postIds.includes(post._id))
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
