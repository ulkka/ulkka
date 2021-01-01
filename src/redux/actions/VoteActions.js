import * as Actions from './ActionTypes';
import mainClient from '../../client/mainClient';

export const vote = (entity, id, voteType, userVote) => {
  return async (dispatch, getState) => {
    console.log(getState().authReducer);
    entity == 'post' ? dispatch(voteStarted()) : dispatch(commentVoteStarted());

    const client = await mainClient;
    if (userVote == voteType) {
      voteType = 0;
    }
    client
      .post(entity + '/' + id + '/vote/' + voteType)
      .then((response) => {
        entity == 'post'
          ? dispatch(voteSuccess(entity, id, voteType))
          : dispatch(commentVoteSuccess(entity, id, voteType));
      })
      .catch((error) => {
        console.log(error);
        entity == 'post'
          ? dispatch(voteFailure(error))
          : dispatch(Actions.commentVoteFailure(entity, id, voteType));
      });
  };
};

export const voteStarted = () => ({
  type: Actions.voteStarted,
});

export const voteSuccess = (entity, id, voteType) => ({
  type: Actions.voteSuccess,
  payload: {
    entity: entity,
    id: id,
    voteType: voteType,
  },
});

export const voteFailure = (error) => ({
  type: Actions.voteFailure,
  payload: {
    error: error,
  },
});

export const commentVoteStarted = () => ({
  type: Actions.commentVoteStarted,
});

export const commentVoteSuccess = (entity, id, voteType) => ({
  type: Actions.commentVoteSuccess,
  payload: {
    entity: entity,
    id: id,
    voteType: voteType,
  },
});

export const commentVoteFailure = (error) => ({
  type: Actions.commentVoteFailure,
  payload: {
    error: error,
  },
});
