import {createSelector} from '@reduxjs/toolkit';
import {selectUserById} from '../reducers/UserSlice';
import {selectCommunityById} from '../reducers/CommunitySlice';
import {selectPostById} from '../reducers/PostSlice';

export const getPostField = (id, field) =>
  createSelector(
    (state) => selectPostById(state, id),
    (post) => post[field],
  );

export const selectFlatPostById = (id) => {
  return createSelector(
    (state) => {
      return {post: selectPostById(state, id), state: state};
    },
    ({post, state}) => {
      const community = selectCommunityById(state, post.community);
      const author = selectUserById(state, post.author);
      const flatPost = {...post, community: community, author: author};
      return flatPost;
    },
  );
};
