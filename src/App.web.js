import React, {useEffect} from 'react';
import {SafeAreaView, Alert} from 'react-native';
import Main from './redux/connectors/mainNav';
import SplashScreen from 'react-native-splash-screen';

import {Provider as StoreProvider} from 'react-redux';
import store from './redux/reducers/index';

import {ThemeProvider} from 'react-native-elements';
import theme from './theme/main';
// import messaging from '@react-native-firebase/messaging';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // }, []);

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <SafeAreaView style={{flex: 1}}>
          <Main />
        </SafeAreaView>
      </ThemeProvider>
    </StoreProvider>
  );
}
