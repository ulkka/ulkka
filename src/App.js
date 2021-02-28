import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import Main from './navigation/Main';
import SplashScreen from 'react-native-splash-screen';
import {Provider as StoreProvider} from 'react-redux';
import store from './redux/reducers/index';
import {ThemeProvider} from 'react-native-elements';
import theme from './theme/main';
import messaging from '@react-native-firebase/messaging';
import EmailLinkHandler from './screens/auth/EmailLinkHandler';
import LoadingOverlay from './components/LoadingOverlay';
import RegisterDeviceToken from './components/RegisterDeviceToken';
import ShareMenuHandler from './components/ShareMenuHandler';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
    requestUserPermission();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <View style={{flex: 1}}>
          {
            //<LoadingOverlay />
          }
          <EmailLinkHandler />
          <RegisterDeviceToken />
          <ShareMenuHandler />
          <Main />
        </View>
      </ThemeProvider>
    </StoreProvider>
  );
}
