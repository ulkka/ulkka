import {fetchFeed} from '../actions/FeedActions';
import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import {createPost} from '../actions/PostActions';

const communityAdapter = createEntityAdapter({
  selectId: (community) => community._id,
});

export const slice = createSlice({
  name: 'community',
  initialState: communityAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [createPost.fulfilled]: (state, action) => {
      /*   const newPostId = action.payload.newPostId;
      const newPost = action.payload.normalizedPost.posts[newPostId];
      const newCommunityId = newPost.community;
      const newCommunity =
        action.payload.normalizedPost.communities[newCommunityId];
      communityAdapter.upsertOne(state, newCommunity);*/
    },
    [fetchFeed.fulfilled]: (state, action) => {
      const normalizedPosts = action.payload.normalizedPosts;

      const isFeedEmpty =
        normalizedPosts &&
        Object.keys(normalizedPosts).length === 0 &&
        normalizedPosts.constructor === Object;

      if (!isFeedEmpty) {
        communityAdapter.addMany(
          state,
          action.payload.normalizedPosts.communities,
        );
      }
    },
  },
});

export const communities = slice.reducer;

export const {
  selectById: selectCommunityById,
  selectIds: selectCommunityIds,
  selectEntities: selectCommunityEntities,
  selectAll: selectAllCommunities,
  selectTotal: selectTotalCommunites,
} = communityAdapter.getSelectors((state) => state.communities);
