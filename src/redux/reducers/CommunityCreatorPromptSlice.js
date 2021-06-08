import {createSlice} from '@reduxjs/toolkit';
import {searchCommunitiesByName} from '../reducers/CommunitySlice';

export const slice = createSlice({
  name: 'communityCreatorPromptSlice',
  initialState: {
    isVisible: false,
    text: '',
  },
  reducers: {
    resetCommunityCreatorPrompt(state, action) {
      state.isVisible = false;
      state.text = '';
    },
  },
  extraReducers: {
    [searchCommunitiesByName.fulfilled]: (state, action) => {
      const {response, text} = action.payload;
      if (response.data === null && response.status == 200) {
        state.isVisible = true;
        state.text = text;
      }
    },
  },
});

export const communityCreatorPrompt = slice.reducer;

export const {resetCommunityCreatorPrompt} = slice.actions;
export const getCommunityCreatorPromptIsVisble = (state) =>
  state.communityCreatorPrompt.isVisible;
export const getCommunityCreatorPromptText = (state) =>
  state.communityCreatorPrompt.text;
