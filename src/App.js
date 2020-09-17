import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import Main from './redux/actions/mainNav';
import SplashScreen from 'react-native-splash-screen';

import { Provider } from 'react-redux';
import store from './redux/reducers/index';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <Main />
      </SafeAreaView>
    </Provider>
  );
}