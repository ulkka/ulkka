import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'tabView',
  initialState: {
    main: {index: 0, tabShown: true, offset: 0},
  },
  reducers: {
    setIndex(state, action) {
      state.main.index = action.payload;
    },
    showTab(state, action) {
      state.main.tabShown = true;
    },
    hideTab(state, action) {
      state.main.tabShown = false;
    },
    setOffset(state, action) {
      const offset = action.payload;
      state.main.offset = offset;
    },
  },
});

export const tabView = slice.reducer;
export const {showTab, hideTab, setOffset, setIndex} = slice.actions;

export const getTabShown = (state) => state.tabView.main.tabShown;
export const getOffset = (state, tab) => state.tabView.main.offset;
export const getIndex = (state) => state.tabView.main.index;
