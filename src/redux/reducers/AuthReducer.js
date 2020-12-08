import * as Actions from '../actions/ActionTypes';

const INITIAL_AUTH_STATE = {
  auth_state: 'LOADING',
  user: null,
  id_token: null,
};

const authReducer = (state = INITIAL_AUTH_STATE, action) => {
  let {auth_state, id_token, user} = state;

  switch (action.type) {
    case Actions.addAuth:
      user = action.payload.user;
      id_token = action.payload.id_token;
      auth_state = 'AUTHENTICATED';
      // let new_state = { auth_state, id_token, user };
      return {auth_state, id_token, user};

    case Actions.removeAuth:
      user = null;
      id_token = null;
      auth_state = 'UNAUTHENTICATED';
      // let new_state = { auth_state, id_token, user };
      return {auth_state, id_token, user};

    case Actions.anonymousAuth:
      user = null;
      id_token = null;
      auth_state = 'ANONYMOUS';
      // let new_state = { auth_state, id_token, user };
      return {auth_state, id_token, user};

    default:
      return state;
  }
};

export default authReducer;
