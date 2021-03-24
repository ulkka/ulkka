import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'optionSheet',
  initialState: {
    visible: false,
    type: null,
    id: null,
    report: false,
  },
  reducers: {
    showOptionSheet(state, action) {
      state.visible = true;
      state.type = action.payload.type;
      state.id = action.payload.id;
      state.report = false;
    },
    hideOptionSheet(state, action) {
      state.visible = false;
      state.type = null;
      state.id = null;
      state.report = false;
    },
    showReportOptions(state, action) {
      state.type = action.payload.type;
      state.id = action.payload.id;
      state.report = true;
    },
  },
  extraReducers: {},
});

export const optionSheet = slice.reducer;
export const {
  showOptionSheet,
  hideOptionSheet,
  showReportOptions,
} = slice.actions;
export const isVisible = (state) => state.optionSheet.visible;
export const getId = (state) => state.optionSheet.id;
export const getType = (state) => state.optionSheet.type;
export const getReport = (state) => state.optionSheet.report;
