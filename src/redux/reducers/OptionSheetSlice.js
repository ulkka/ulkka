import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'optionSheet',
  initialState: {
    visible: false,
    type: null,
    id: null,
  },
  reducers: {
    showOptionSheet(state, action) {
      state.visible = true;
      state.type = action.payload.type;
      state.id = action.payload.id;
    },
    hideOptionSheet(state, action) {
      state.visible = false;
      state.type = null;
      state.id = null;
    },
  },
  extraReducers: {},
});

export const optionSheet = slice.reducer;
export const {showOptionSheet, hideOptionSheet} = slice.actions;
export const isVisible = (state) => state.optionSheet.visible;
