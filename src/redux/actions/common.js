import Snackbar from 'react-native-snackbar';
import {showAuthScreen} from '../../navigation/Ref';
import analytics from '@react-native-firebase/analytics';

export const handleError = (state, action) => {
  const {name: errorName} = action.error;
  if (errorName == 'ConditionError') {
    analytics().logEvent('login_request', {type: action.type});
    showAuthScreen();
  }
  if (errorName == 'RejectWithValue') {
    Snackbar.show({
      text: 'Sorry, please try again later',
      duration: Snackbar.LENGTH_SHORT,
    });
  }
};
