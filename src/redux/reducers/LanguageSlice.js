import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getData, storeData} from '../../localStorage/helpers';
import i18n from 'i18next';

const defaultLanguage = 'en';

export const setLanguage = createAsyncThunk(
  'language/set',
  async (language, {rejectWithValue}) => {
    try {
      await storeData('language', language);
      i18n.changeLanguage(language);
      return language;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const loadLanguage = createAsyncThunk(
  'language/load',
  async (language, {rejectWithValue}) => {
    try {
      const activeLanguage = await getData('language');
      if (!activeLanguage) {
        await storeData('language', defaultLanguage);
        i18n.changeLanguage(defaultLanguage);
        return defaultLanguage;
      }
      i18n.changeLanguage(activeLanguage);
      return activeLanguage;
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const slice = createSlice({
  name: 'language',
  initialState: {
    activeLanguage: 'en',
  },
  reducers: {},
  extraReducers: {
    [loadLanguage.fulfilled]: (state, action) => {
      const language = action.payload;
      state.activeLanguage = language;
    },
    [setLanguage.fulfilled]: (state, action) => {
      const language = action.payload;
      state.activeLanguage = language;
    },
  },
});

export const language = slice.reducer;
export const getLanguage = state => state.language.activeLanguage;
