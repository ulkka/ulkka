import Snackbar from 'react-native-snackbar';
import {showAuthScreen} from '../../navigation/Ref';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {Platform, PermissionsAndroid, Linking, Alert} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

export async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  console.log('hasPermission', hasPermission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  console.log('permission status', status);
  return status === 'granted';
}

export async function savePicture({tag, album}, rejectWithValue) {
  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
    return;
  }

  return CameraRoll.save(tag, {album, type: 'auto'}).catch((error) => {
    console.log('error saving image to camera roll', error);

    if (error.message == 'User cancelled image selection') {
      return;
    }
    const title =
      Platform.OS == 'ios'
        ? 'Please allow access to your Photos'
        : 'Please allow access to your Media Library';
    const message =
      Platform.OS == 'ios'
        ? 'This allows Ulkka to save media to your Photo library'
        : 'This allows Ulkka to share media from your library. Kindly enable Permissions->Storage in the application settings';
    const settingsTitle =
      Platform.OS == 'ios' ? 'Enable Library Access' : 'Go to Settings';

    analytics().logEvent('mediapermission_unavailable');

    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          onPress: () => {
            analytics().logEvent('mediapermission_deny');
            console.log('Cancel Pressed');
          },
          style: 'cancel',
        },
        {
          text: settingsTitle,
          onPress: () => {
            analytics().logEvent('mediapermission_settingsenable');
            Linking.openSettings();
          },
          style: 'default',
        },
      ],
      {cancelable: true},
    );
    return rejectWithValue(error);
  });
}

export function getAlbumFromType(type) {
  switch (type) {
    case 'image':
      return 'Ulkka Images';
    case 'video':
      return 'Ulkka Videos';
    case 'gif':
      return 'Ulkka GIFs';

    default:
      return 'Ulkka';
  }
}

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
