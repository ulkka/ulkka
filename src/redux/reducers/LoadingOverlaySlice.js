import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  socialAuth,
  emailLinkAuth,
  registerUser,
  signout,
  sendEmailSignInLink,
  loadAuth,
} from '../actions/AuthActions';

const showLoadingOverlay = (state) => {
  state.visible = true;
};
const hideLoadingOverlay = (state) => {
  state.visible = false;
};

export const slice = createSlice({
  name: 'loadingOverlay',
  initialState: {
    visible: false,
  },
  reducers: {
    showOverlay(state) {
      state.visible = true;
    },
    hideOverlay(state) {
      state.visible = false;
    },
  },
  extraReducers: {
    /*[loadAuth.pending]: (state, action) => {
      showLoadingOverlay(state);
    },
    [loadAuth.fulfilled]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [loadAuth.rejected]: (state, action) => {
      hideLoadingOverlay(state);
    },*/
    [sendEmailSignInLink.pending]: (state, action) => {
      showLoadingOverlay(state);
    },
    [sendEmailSignInLink.fulfilled]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [sendEmailSignInLink.rejected]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [socialAuth.pending]: (state, action) => {
      showLoadingOverlay(state);
    },
    [socialAuth.fulfilled]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [socialAuth.rejected]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [emailLinkAuth.pending]: (state, action) => {
      showLoadingOverlay(state);
    },
    [emailLinkAuth.fulfilled]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [emailLinkAuth.rejected]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [registerUser.pending]: (state, action) => {
      showLoadingOverlay(state);
    },
    [registerUser.fulfilled]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [registerUser.rejected]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [signout.pending]: (state, action) => {
      showLoadingOverlay(state);
    },
    [signout.fulfilled]: (state, action) => {
      hideLoadingOverlay(state);
    },
    [signout.rejected]: (state, action) => {
      hideLoadingOverlay(state);
    },
  },
});

export const loadingOverlay = slice.reducer;
//export const {showOverlay, hideOverlay} = slice.actions;
export const isVisible = (state) => state.loadingOverlay.visible;
