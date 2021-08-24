import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Appearance} from 'react-native';
import {getData, storeData} from '../../localStorage/helpers';

const defaultTheme = 'auto';

export const setTheme = createAsyncThunk(
  'theme/set',
  async (theme, {rejectWithValue}) => {
    try {
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
      const colorScheme = Appearance.getColorScheme();
      const isColorSchemeDark = colorScheme === 'dark';

      const theme = await getData('theme');
      if (!theme) {
        await storeData('theme', defaultTheme);
        return {theme: defaultTheme, isDark: isColorSchemeDark};
      }

      const isDark =
        theme === 'auto' ? colorScheme === 'dark' : theme === 'dark';
      return {theme, isDark};
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const slice = createSlice({
  name: 'theme',
  initialState: {
    theme: defaultTheme,
  },
  reducers: {
    setIsDark(state, action) {
      const isDark = action.payload;
      state.isDark = isDark;
    },
  },
  extraReducers: {
    [loadTheme.fulfilled]: (state, action) => {
      const {theme, isDark} = action.payload;
      state.theme = theme;
      state.isDark = isDark;
    },
    [setTheme.fulfilled]: (state, action) => {
      const theme = action.payload;
      state.theme = theme;

      const colorScheme = Appearance.getColorScheme();
      const isDark =
        theme === 'auto' ? colorScheme === 'dark' : theme === 'dark';
      state.isDark = isDark;
    },
  },
});

export const theme = slice.reducer;
export const {setIsDark} = slice.actions;
export const getTheme = state => state.theme.theme;
export const getIsDark = state => state.theme.isDark;
