import {createSelector} from '@reduxjs/toolkit';
import {selectUserById, selectUserEntities} from '../reducers/UserSlice';
import {
  selectCommunityById,
  selectCommunityEntities,
} from '../reducers/CommunitySlice';
import {selectPostById, selectPostEntities} from '../reducers/PostSlice';
import {getFeedPostIds} from './FeedSelectors';

export const getPostField = (id, field) => {
  return createSelector(
    (state) => selectPostById(state, id),
    (post) => post[field],
  );
};

export const getPostCommunityDetail = (id) => {
  return createSelector(
    (state) => {
      return {post: selectPostById(state, id), state};
    },
    ({post, state}) => selectCommunityById(state, post.community),
  );
};

export const getPostAuthorDetail = (id) => {
  return createSelector(
    (state) => {
      return {post: selectPostById(state, id), state};
    },
    ({post, state}) => selectUserById(state, post.author),
  );
};

export const selectFlatPostById = (id) => {
  return createSelector(
    (state) => {
      return {post: selectPostById(state, id), state};
    },
    ({post, state}) => {
      const community = selectCommunityById(state, post.community);
      const author = selectUserById(state, post.author);
      const flatPost = {
        ...post,
        communityDetail: community,
        authorDetail: author,
      };
      return flatPost;
    },
  );
};

export const selectFlatPosts = (screen) => {
  return createSelector(
    [
      getFeedPostIds(screen),
      selectPostEntities,
      selectCommunityEntities,
      selectUserEntities,
    ],
    (postIds, postEntities, communityEnitities, userEntities) => {
      let posts = [];
      postIds.map((postId) => {
        let post = postEntities[postId];
        let communityDetail = communityEnitities[post.community];
        let authorDetail = userEntities[post.author];
        posts.push({
          ...post,
          communityDetail: communityDetail,
          authorDetail: authorDetail,
        });
      });
      return posts;
    },
  );
};
