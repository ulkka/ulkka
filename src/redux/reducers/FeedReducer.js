import * as Actions from '../actions/ActionTypes';

const INITIAL_OPTIONSHEET_STATE = {
  feed: [],
  loading: false,
  error: '',
};

const feedReducer = (state = INITIAL_OPTIONSHEET_STATE, action) => {
  let {feed, loading, error} = state;

  switch (action.type) {
    case Actions.feedFetchStarted:
      feed = [];
      loading = true;
      error = '';
      return {feed, loading, error};

    case Actions.feedFetchSuccess:
      feed = action.payload.feed;
      loading = false;
      error = '';
      return {feed, loading, error};

    case Actions.feedFetchFailure:
      feed = [];
      loading = false;
      error = action.payload.error;
      return {feed, loading, error};

    default:
      return state;
  }
};

export default feedReducer;
