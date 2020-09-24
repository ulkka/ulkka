import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import Main from './redux/actions/mainNav';
import SplashScreen from 'react-native-splash-screen';

import { Provider as StoreProvider } from 'react-redux';
import store from './redux/reducers/index';

import { ThemeProvider } from 'react-native-elements';
import theme from './theme/main';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <StoreProvider store={store} >
      <ThemeProvider theme={theme} >
        <SafeAreaView style={{ flex: 1 }}>
          <Main />
        </SafeAreaView>
      </ThemeProvider>
    </StoreProvider>
  );
}