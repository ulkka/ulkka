import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import analytics from '@react-native-firebase/analytics';
import {votePost} from '../actions/PostActions';
import {voteComment} from '../actions/CommentActions';
import {markNotificationRead} from './NotificationSlice';
import {getData, storeData} from '../../localStorage/helpers';

const voteCountLimit = 5;
const notificationReadLimit = 2;
const initialRequestWaitDays = 2;
const subsequentRequestWaitDays = 14;

const initReviewRequestLocalStorage = async () => {
  let requestCount = 0;
  let notificationReadCount = 0;
  let voteCount = 0;
  let lastShown = new Date();
  let hasReviewed = 0;

  await storeData('notificationReadCount', notificationReadCount.toString());
  await storeData('requestCount', requestCount.toString());
  await storeData('lastShown', lastShown.toISOString());
  await storeData('voteCount', voteCount.toString());
  await storeData('hasReviewed', hasReviewed.toString());
};

const shouldShowRequestReview = (state, action) => {
  let {
    voteCount,
    requestCount,
    notificationReadCount,
    lastShown,
    hasReviewed,
  } = state.data;
  let currDateTime = new Date();

  if (!!hasReviewed) {
    return false;
  }

  if (requestCount === 0) {
    let diffTime = Math.abs(currDateTime - lastShown);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (
      diffDays >= initialRequestWaitDays &&
      voteCount >= voteCountLimit &&
      notificationReadCount >= notificationReadLimit
    ) {
      return true;
    }
    return false;
  }

  if (requestCount > 0) {
    let diffTime = Math.abs(currDateTime - lastShown);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (
      diffDays >= subsequentRequestWaitDays &&
      voteCount >= voteCountLimit &&
      notificationReadCount >= notificationReadLimit
    ) {
      return true;
    }
    return false;
  }
  return false;
};

const incrementVoteCountInStorage = async (state, action) => {
  const {voteType} = action.meta.arg;
  let voteCount = parseInt(await getData('voteCount'));
  if (voteType === 1) {
    await storeData('voteCount', (voteCount + 1).toString());
  }
};

const incrementNotificationReadCountInStorage = async (state, action) => {
  let notificationReadCount = parseInt(await getData('notificationReadCount'));

  await storeData(
    'notificationReadCount',
    (notificationReadCount + 1).toString(),
  );
};

const incrementVoteCountInState = async (state, action) => {
  const {voteType} = action.meta.arg;
  if (voteType === 1) {
    state.data.voteCount += 1;
  }
};

function voteHandler(state, action) {
  incrementVoteCountInStorage(state, action);
  incrementVoteCountInState(state, action);

  const {voteType} = action.meta.arg;
  const shouldShow = shouldShowRequestReview(state, action);
  if (shouldShow && voteType === 1) {
    state.isVisible = true;
    analytics().logEvent('review_request_show', {
      value: state.requestCount,
      type: 'after_vote',
    });
  }
}

export const loadData = createAsyncThunk('reviewRequest/load', async () => {
  let voteCount = parseInt(await getData('voteCount'));
  let requestCount = parseInt(await getData('requestCount'));
  let notificationReadCount = parseInt(await getData('notificationReadCount'));
  let lastShown = new Date(await getData('lastShown'));
  let hasReviewed = parseInt(await getData('hasReviewed'));

  if (!requestCount && requestCount !== 0) {
    initReviewRequestLocalStorage();
    return {
      voteCount: 0,
      requestCount: 0,
      notificationReadCount: 0,
      lastShown: new Date(),
      hasReviewed: 0,
    };
  }

  return {
    voteCount,
    requestCount,
    notificationReadCount,
    lastShown,
    hasReviewed,
  };
});

export const reviewDone = createAsyncThunk('reviewRequest/done', async () => {
  await storeData('hasReviewed', '1');
});

export const reviewLater = createAsyncThunk('reviewRequest/later', async () => {
  const requestCount = parseInt(await getData('requestCount'));
  await storeData('requestCount', (requestCount + 1).toString());

  const lastShown = new Date();
  await storeData('lastShown', lastShown.toISOString());

  let notificationReadCount = 0;
  let voteCount = 0;

  await storeData('notificationReadCount', notificationReadCount.toString());
  await storeData('voteCount', voteCount.toString());
});

const slice = createSlice({
  name: 'reviewRequest',
  initialState: {
    isVisible: false,
  },
  reducers: {
    showReviewRequest(state, action) {
      state.isVisible = true;
    },
    hideReviewRequest(state, action) {
      state.isVisible = false;
    },
  },
  extraReducers: {
    [loadData.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [voteComment.fulfilled]: (state, action) => {
      voteHandler(state, action);
    },
    [votePost.fulfilled]: (state, action) => {
      voteHandler(state, action);
    },
    [markNotificationRead.fulfilled]: (state, action) => {
      incrementNotificationReadCountInStorage();
      state.data.notificationReadCount += 1;
      const shouldShow = shouldShowRequestReview(state, action);
      if (shouldShow) {
        state.isVisible = true;
        analytics().logEvent('review_request_show', {
          value: state.requestCount,
          type: 'after_read_notification',
        });
      }
    },
    [reviewDone.fulfilled]: (state, action) => {
      state.isVisible = false;
      state.data.hasReviewed = 1;
      analytics().logEvent('review_request_approve', {
        value: state.requestCount,
      });
    },
    [reviewLater.fulfilled]: (state, action) => {
      state.isVisible = false;

      state.data.requestCount += 1;
      state.data.lastShown = new Date();
      state.data.notificationReadCount = 0;
      state.data.voteCount = 0;
      analytics().logEvent('review_request_later', {value: state.requestCount});
    },
  },
});

export const reviewRequest = slice.reducer;
export const {showReviewRequest, hideReviewRequest} = slice.actions;

export const getIsVisible = state => state.reviewRequest.isVisible;
