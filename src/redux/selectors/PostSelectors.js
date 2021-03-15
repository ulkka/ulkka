import {createSelector} from '@reduxjs/toolkit';
import {selectUserEntities} from '../reducers/UserSlice';
import {selectCommunityEntities} from '../reducers/CommunitySlice';
import {selectPostById, selectAllPosts} from '../reducers/PostSlice';
import {getFeedPostIds} from './FeedSelectors';

//  So far we have only seen selectors receive the Redux store state as an argument, but a selector can receive props too.
//  refactor https://github.com/reduxjs/reselect#accessing-react-props-in-selectors

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

//  So far we have only seen selectors receive the Redux store state as an argument, but a selector can receive props too.
//  refactor https://github.com/reduxjs/reselect#accessing-react-props-in-selectors
export const selectFlatPosts = createSelector(
  [getFeedPostIds, selectAllPosts, selectCommunityEntities, selectUserEntities],
  (postIds, allPosts, communityEnitities, userEntities) =>
    allPosts
      .filter((post) => postIds.includes(post._id))
      .map((post) => {
        return {
          ...post,
          communityDetail: communityEnitities[post.community],
          authorDetail: userEntities[post.author],
        };
      }),
);
