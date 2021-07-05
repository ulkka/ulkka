import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import notificationsApi from '../../services/NotificationsApi';

const notificationAdapter = createEntityAdapter({
  selectId: (notification) => notification._id,
});

export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnread',
  async (type, {getState, rejectWithValue}) => {
    try {
      const {page, limit} = getState().notifications.metadata;
      const nextPage = page + 1;
      const response = await notificationsApi.getUnreadNotifications(
        nextPage,
        limit,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (type, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const authAccess = isRegistered ? true : false;

      const currentState = getState().notifications;
      const requestAccess = !currentState.complete && !currentState.loading;

      return authAccess && requestAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const fetchAllNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (type, {getState, rejectWithValue}) => {
    try {
      const {page, limit} = getState().notifications.metadata;
      const nextPage = page + 1;
      const response = await notificationsApi.getAllNotifications(
        nextPage,
        limit,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (type, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const authAccess = isRegistered ? true : false;

      const currentState = getState().notifications;
      const requestAccess = !currentState.complete && !currentState.loading;

      return authAccess && requestAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (type, {rejectWithValue}) => {
    try {
      notificationsApi.markAllRead();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (type, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const authAccess = isRegistered ? true : false;

      return authAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id, {rejectWithValue, dispatch}) => {
    try {
      if (id) {
        await notificationsApi.markRead(id);
        dispatch(fetchUnreadNotificationCount());
      }
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (type, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const authAccess = isRegistered ? true : false;

      return authAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const fetchUnreadNotificationCount = createAsyncThunk(
  'notifications/fetchUnreadNotificationCount',
  async (id, {rejectWithValue}) => {
    try {
      const response = await notificationsApi.unReadCount();
      return response.data?.count;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
  {
    condition: (id, {getState}) => {
      const isRegistered = getState().authorization.isRegistered;
      const authAccess = isRegistered ? true : false;

      return authAccess;
    },
    dispatchConditionRejection: true,
  },
);

export const slice = createSlice({
  name: 'notifications',
  initialState: {
    unreadCount: 0,
    ids: [],
    entities: {},
    metadata: {
      page: 0,
      total: -1,
      limit: 10,
    },
    complete: false,
    loading: false,
    needsRefresh: false,
  },
  reducers: {
    incrementNotificationCount(state, action) {
      state.unreadCount++;
      state.needsRefresh = true;
    },
    decrementNotificationCount(state, action) {
      state.unreadCount && state.unreadCount--;
    },
    setUnreadCountZero(state, action) {
      state.unreadCount = 0;
    },
    resetNotifications(state, action) {
      notificationAdapter.removeAll(state);
      state.needsRefresh = false;
      state.complete = false;
      state.loading = false;
      state.metadata = {
        page: 0,
        total: -1,
        limit: 10,
      };
    },
  },
  extraReducers: {
    [fetchAllNotifications.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAllNotifications.fulfilled]: (state, action) => {
      const getAllNotifications = action.payload.data?.data;
      const metadata = action.payload.data?.metadata[0];
      const page = metadata?.page;
      const total = page && metadata.total;
      const limit = page && metadata.limit;

      const isComplete = page ? total <= limit * page : true;

      notificationAdapter.addMany(state, getAllNotifications);
      state.metadata = metadata;
      state.loading = false;
      state.complete = isComplete;
    },
    [fetchUnreadNotifications.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUnreadNotifications.fulfilled]: (state, action) => {
      const unreadNotifications = action.payload.data?.data;
      const metadata = action.payload.data?.metadata[0];

      const page = metadata?.page;
      const total = page && metadata.total;
      const limit = page && metadata.limit;

      const isComplete = total <= limit * page;

      notificationAdapter.addMany(state, unreadNotifications);
      state.metadata = metadata;
      state.loading = false;
      state.complete = isComplete;
    },
    [markAllNotificationsRead.fulfilled]: (state, action) => {
      const allNotificationIds = notificationAdapter
        .getSelectors()
        .selectIds(state);
      allNotificationIds.map((id, index) => {
        notificationAdapter.updateOne(state, {id: id, changes: {read: true}});
      });
      state.unreadCount = 0;
    },
    [markNotificationRead.fulfilled]: (state, action) => {
      const id = action.payload;
      notificationAdapter.updateOne(state, {
        id: id,
        changes: {
          read: true,
        },
      });
    },
    [fetchUnreadNotificationCount.fulfilled]: (state, action) => {
      const count = action.payload;
      state.unreadCount = count;
    },
  },
});

export const notifications = slice.reducer;
export const {
  incrementNotificationCount,
  decrementNotificationCount,
  setUnreadCountZero,
  resetNotifications,
} = slice.actions;

export const {
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
  selectEntities: selectNotificationEntities,
  selectAll: selectAllNotifications,
  selectTotal: selectTotalNotifications,
} = notificationAdapter.getSelectors((state) => state.notifications);

export const getUnreadNotificationCount = (state) =>
  state.notifications.unreadCount;

export const isNotificationsLoading = (state) => state.notifications.loading;
export const isNotificationsComplete = (state) => state.notifications.complete;
export const getNeedsRefresh = (state) => state.notifications.needsRefresh;
