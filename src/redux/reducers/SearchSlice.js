import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'search',
  initialState: {
    term: '',
    searchMode: false,
    serverSearch: false,
  },
  reducers: {
    resetSearch(state, action) {
      state.term = '';
      state.searchMode = false;
      state.serverSearch = false;
    },
    setSearchTerm(state, action) {
      const term = action.payload;
      state.term = term;
    },
    setSearchMode(state, action) {
      state.searchMode = action.payload;
    },
    setServerSearch(state, action) {
      state.serverSearch = action.payload;
    },
  },
});

export const search = slice.reducer;
export const {
  resetSearch,
  setSearchTerm,
  setSearchMode,
  setServerSearch,
} = slice.actions;

export const getSearchTerm = (state, excludeHash) =>
  !excludeHash ? state.search.term : state.search.term.replace('#', '');
export const getSearchMode = (state) => state.search.searchMode;
export const getServerSearch = (state) => state.search.serverSearch;
