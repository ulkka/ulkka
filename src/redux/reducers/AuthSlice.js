import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import {voteComment} from './CommentSlice';
import {votePost} from './PostSlice';
import {createReply, activate} from './ReplySlice';
import {navigate} from '../../screens/auth/AuthNavigation';

export const loadAuth = createAsyncThunk('authorization/load', async () => {
  const currentUser = await auth().currentUser;
  if (currentUser) {
    const idToken = await currentUser.getIdToken(false);
    console.log('got idtoken - ', idToken);
    return {currentUser: currentUser, idToken: idToken};
  } else {
    await auth().signInAnonymously();
    const currentUser = await auth().currentUser;
    const idToken = await currentUser.getIdToken(false);
    console.log('got idtoken for new anonymous - ', idToken);
    return {currentUser: currentUser, idToken: idToken};
  }
});

export const slice = createSlice({
  name: 'authorization',
  initialState: {
    status: 'UNAUTHENTICATED',
    user: null,
    idToken: null,
  },
  reducers: {},
  extraReducers: {
    [loadAuth.fulfilled]: (state, action) => {
      console.log('loadingauth fulfilled', state, action);
      const currentUser = action.payload.currentUser;
      const idToken = action.payload.idToken;
      state.user = currentUser;
      if (currentUser.isAnonymous) {
        state.status = 'ANONYMOUS';
      } else {
        state.status = 'AUTHENTICATED';
      }
      state.idToken = idToken;
    },
    [votePost.rejected]: (state, action) => {
      console.log('votePost rejected', state, action);
      navigate('Signin');
    },
    [voteComment.rejected]: (state, action) => {
      console.log('votePost rejected', state, action);
      navigate('Signin');
    },
    [createReply.rejected]: (state, action) => {
      console.log('votePost rejected', state, action);
      navigate('Signin');
    },
    [activate.rejected]: (state, action) => {
      console.log('votePost rejected', state, action);
      navigate('Signin');
    },
  },
});

export const authorization = slice.reducer;
export const getAuthStatus = (state) => state.authorization.status;
