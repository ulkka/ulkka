import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'creatorOverlay',
  initialState: {enableOverlay: false, communityId: undefined},
  reducers: {
    showCreatorOverlay(state, action) {
      const communityId = action.payload;
      state.enableOverlay = true;
      state.communityId = communityId;
    },
    hideCreatorOverlay(state, action) {
      state.enableOverlay = false;
      state.communityId = undefined;
    },
    toggleCreatorOverlay(state, action) {
      const enableOverlay = state.enableOverlay;
      state.enableOverlay = !enableOverlay;
      if (enableOverlay) {
        state.communityId = undefined;
      }
    },
  },
});

export const creatorOverlay = slice.reducer;
export const {
  showCreatorOverlay,
  hideCreatorOverlay,
  toggleCreatorOverlay,
} = slice.actions;
export const getEnableOverlay = (state) => state.creatorOverlay.enableOverlay;
export const getCreatorCommunityId = (state) =>
  state.creatorOverlay.communityId;
