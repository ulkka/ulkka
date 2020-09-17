import * as Actions from './ActionTypes';

export const addAuth = (user, id_token) => (
  {
    type: Actions.addAuth,
    payload: {
      user: user,
      id_token: id_token
    },
  }
);

export const removeAuth = () => (
  {
    type: Actions.removeAuth,
  }
);