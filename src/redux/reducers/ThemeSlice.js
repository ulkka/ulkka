import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getData, storeData} from '../../localStorage/helpers';

const defaultTheme = 'auto';

export const setTheme = createAsyncThunk(
  'theme/set',
  async (theme, {rejectWithValue}) => {
    try {
      console.log('setting theme', theme);
      await storeData('theme', theme);
      return theme;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const loadTheme = createAsyncThunk(
  'theme/load',
  async (theme, {rejectWithValue}) => {
    try {
      const theme = await getData('theme');
      console.log('theme in asyncthunk', theme);
      if (!theme) {
        await storeData('theme', defaultTheme);
        return defaultTheme;
      }
      return theme;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const slice = createSlice({
  name: 'themeSlice',
  initialState: {
    theme: defaultTheme,
  },
  reducers: {},
  extraReducers: {
    [loadTheme.fulfilled]: (state, action) => {
      const theme = action.payload;
      state.theme = theme;
    },
    [setTheme.fulfilled]: (state, action) => {
      const theme = action.payload;
      state.theme = theme;
    },
  },
});

export const theme = slice.reducer;

export const getTheme = state => state.theme.theme;
