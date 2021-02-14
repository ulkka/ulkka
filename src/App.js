import React, {useEffect} from 'react';
import {SafeAreaView, Alert} from 'react-native';
import Main from './navigation/Main';
import SplashScreen from 'react-native-splash-screen';

import {Provider as StoreProvider} from 'react-redux';
import store from './redux/reducers/index';

import {ThemeProvider} from 'react-native-elements';
import theme from './theme/main';
import messaging from '@react-native-firebase/messaging';
import EmailLinkHandler from './screens/auth/EmailLinkHandler';
import LoadingOverlay from './components/LoadingOverlay';
import dynamicLinks from '@react-native-firebase/dynamic-links';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        console.log('initial dynamic link', link);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <SafeAreaView style={{flex: 1}}>
          <LoadingOverlay />
          <EmailLinkHandler />
          <Main />
        </SafeAreaView>
      </ThemeProvider>
    </StoreProvider>
  );
}
