import Snackbar from 'react-native-snackbar';
import {showAuthScreen} from '../../navigation/Ref';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

export const handleError = (state, action) => {
  const {name: errorName} = action.error;
  if (errorName == 'ConditionError') {
    const type = action.type;
    analytics().logEvent('login_request', {type: type});
    if (type == 'user/block/rejected') {
      // adding the condtion to avoid ''you may not call getState() while the reducer is execting.
      // Its happening because user state is used by Auth Navigation which uses selectors dependent on user slice
      setTimeout(
        () =>
          Snackbar.show({
            text: 'You need to be signed in to block users',
            duration: Snackbar.LENGTH_LONG,
            action: {
              text: 'Sign in',
              textColor: '#25D366',
              onPress: () => showAuthScreen(),
            },
          }),
        100,
      );
    } else {
      showAuthScreen();
    }
  }
  if (errorName == 'RejectWithValue') {
    const type = action.type;
    if (
      type != 'authorization/login/social/rejected' &&
      type != 'authorization/login/emaillink/rejected'
    ) {
      crashlytics().recordError(action.payload);
      Snackbar.show({
        text: 'Sorry, please try again later',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }
};
