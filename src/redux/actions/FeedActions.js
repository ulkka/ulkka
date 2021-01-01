import * as Actions from './ActionTypes';
import mainClient from '../../client/mainClient';

export const feedFetch = () => {
  return async (dispatch) => {
    dispatch(feedFetchStarted());

    const client = await mainClient;
    client
      .get('post?populate=community')
      .then((response) => {
        console.log(
          'Successfully got Home Feed from server through Redux - ',
          response.data.length,
        );
        dispatch(feedFetchSuccess(response.data));
      })
      .catch((error) => {
        console.log(
          'Error getting Home Feed from server through Redux -',
          error,
        );
        dispatch(feedFetchFailure(error));
      });
  };
};

export const feedFetchStarted = () => ({
  type: Actions.feedFetchStarted,
});

export const feedFetchSuccess = (feed) => ({
  type: Actions.feedFetchSuccess,
  payload: {
    feed: feed,
  },
});

export const feedFetchFailure = (error) => ({
  type: Actions.feedFetchFailure,
  payload: {
    error: error,
  },
});
