import * as Actions from './ActionTypes';
import mainClient from '../../client/mainClient';

export const addAuth = (user, id_token) => ({
  type: Actions.addAuth,
  payload: {
    user: user,
    id_token: id_token,
  },
});

export const removeAuth = () => ({
  type: Actions.removeAuth,
});

export function authenticate(user, id_token) {
  return (dispatch) => {
    mainClient.interceptors.request.use(
      (config) => {
        console.log('Adding Bearer token to client from Thunk!')
        config.headers.Authorization = 'Bearer ' + id_token;
        return config;
      },
      (error) => Promise.reject(error),
    );
    dispatch(addAuth(user,id_token));
  };
}

export function unAuthenticate() {
  return (dispatch) => {
    mainClient.interceptors.request.use(
      (config) => {
        console.log('Removing Bearer token from client from Thunk!')
        config.headers.Authorization = '';
        return config;
      },
      (error) => Promise.reject(error),
    );
    dispatch(removeAuth());
  };
}
