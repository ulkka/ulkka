import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from '@reduxjs/toolkit';

const postDetailAdapter = createEntityAdapter({
  selectId: (post) => post._id,
});

const slice = createSlice({
  name: 'postDetail',
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {},
  extraReducers: {},
});

const initialEntityState = (postId) => {
  return {
    _id: postId,
    loaded: false,
    isViewable: true,
    paused: true,
  };
};

export const postDetail = slie.reducer;

export const {
  selectById: selectPostDetailById,
  selectIds: selectPostDetailIds,
  selectEntities: selectPostDetailEntities,
  selectAll: selectAllPostDetails,
  selectTotal: selectTotalPostDetails,
} = postDetailAdapter.getSelectors((state) => state);
