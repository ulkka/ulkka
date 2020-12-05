import * as Actions from './ActionTypes';

export const showOptionSheet = (type, id) => ({
  type: Actions.showOptionSheet,
  payload: {
    type: type,
    id: id,
  },
});

export const hideOptionSheet = () => ({
  type: Actions.hideOptionSheet,
});
