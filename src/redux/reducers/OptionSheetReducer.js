import * as Actions from '../actions/ActionTypes';

const INITIAL_OPTIONSHEET_STATE = {
  isVisible: false,
  type: null,
  id: null,
};

const optionSheetReducer = (state = INITIAL_OPTIONSHEET_STATE, action) => {
  let {isVisible, type, id} = state;

  switch (action.type) {
    case Actions.showOptionSheet:
      isVisible = true;
      type = action.payload.type;
      id = action.payload.id;
      return {isVisible, type, id};

    case Actions.hideOptionSheet:
      isVisible = false;
      type = null;
      id = null;
      return {isVisible, type, id};

    default:
      return state;
  }
};

export default optionSheetReducer;
