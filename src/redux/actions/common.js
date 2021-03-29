import Snackbar from 'react-native-snackbar';
import {showAuthScreen} from '../../navigation/Ref';

export const handleError = (state, action) => {
  console.log('action error', action);
  const {name: errorName} = action.error;
  if (errorName == 'ConditionError') {
    showAuthScreen();
  }
  if (errorName == 'RejectWithValue') {
    Snackbar.show({
      text: 'Sorry, please try again later',
      duration: Snackbar.LENGTH_SHORT,
    });
  }
};
