import * as Actions from '../actions/ActionTypes';
import update from 'immutability-helper';

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {normalize, schema} from 'normalizr';

const INITIAL_FEED_STATE = {
  feed: [],
  feedMap: new Map(),
  loading: false,
  error: '',
  normalisedFeed: null,
};

const feedEntity = new schema.Entity('feed', {}, {idAttribute: '_id'});

const feedReducer = (state = INITIAL_FEED_STATE, action) => {
  let {feed, loading, feedMap, error} = state;

  switch (action.type) {
    case Actions.feedFetchStarted:
      feed = [];
      feedMap = new Map();
      loading = true;
      error = '';
      normalisedFeed = null;
      return {feed, loading, feedMap, error, normalisedFeed};

    case Actions.feedFetchSuccess:
      feed = action.payload.feed;
      feedMap = new Map(feed.map((obj, index) => [obj._id, index]));
      normalisedFeed = normalize(action.payload.feed, [feedEntity]);
      //  const normalized = normalize(response.data, [userEntity])
      loading = false;
      error = '';
      return {feed, loading, feedMap, error, normalisedFeed};

    case Actions.feedFetchFailure:
      feed = [];
      loading = false;
      feedMap = new Map();
      error = action.payload.error;
      return {feed, loading, feedMap, error, normalisedFeed};

    case Actions.voteSuccess:
      var postIndex = feedMap.get(action.payload.id);
      var diff = action.payload.voteType - feed[postIndex].userVote;
      return update(state, {
        feed: {
          [postIndex]: {
            voteCount: {
              $set: feed[postIndex].voteCount + diff,
            },
            userVote: {$set: action.payload.voteType},
          },
        },
      });

    case Actions.increaseCommentCount:
      var postIndex = feedMap.get(action.payload.postId);
      var prevCommentCount = feed[postIndex].commentCount;

      return update(state, {
        feed: {
          [postIndex]: {
            commentCount: {
              $set: prevCommentCount + 1,
            },
          },
        },
      });

    case Actions.decreaseCommentCount:
      var postIndex = feedMap.get(action.payload.postId);
      var prevCommentCount = feed[postIndex].commentCount;

      return update(state, {
        feed: {
          [postIndex]: {
            commentCount: {
              $set: prevCommentCount - 1,
            },
          },
        },
      });

    default:
      return state;
  }
};

export default feedReducer;
