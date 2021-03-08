import postApi from '../../services/PostApi';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const votePost = createAsyncThunk(
  'posts/vote',
  async ({id, voteType}, thunkAPI) => {
    let response = await postApi.post.vote(id, voteType);
    return response;
  },
  {
    condition: ({id, voteType}, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const access = isRegistered ? true : false;
      return access;
    },
    dispatchConditionRejection: true,
  },
);

function resetState(state, type) {
  postAdapter.removeAll(state);
}
