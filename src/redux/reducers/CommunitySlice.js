import {fetchPosts} from './PostSlice';
import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

const communityAdapter = createEntityAdapter({
  selectId: (community) => community._id,
});

export const slice = createSlice({
  name: 'community',
  initialState: communityAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [fetchPosts.fulfilled]: (state, action) => {
      communityAdapter.upsertMany(state, action.payload.communities);
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
