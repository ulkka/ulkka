import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import Main from './navigation/Main';
import SplashScreen from 'react-native-splash-screen';
import {Provider as StoreProvider} from 'react-redux';
import store from './redux/reducers/index';
import {ThemeProvider} from 'react-native-elements';
import theme from './theme/main';
import EmailLinkHandler from './screens/auth/EmailLinkHandler';
import LoadingOverlay from './components/LoadingOverlay';
import RegisterDeviceToken from './components/RegisterDeviceToken';
//import ShareMenuHandler from './components/ShareMenuHandler';
import OptionSheet from './components/OptionSheet';
import IdTokenListener from './client/IdTokenListener';
import AppUpdateHandler from './components/AppUpdateHandler';

export default function App() {
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const requestAppUpdate = (value) => {
    setShouldUpdate(value);
  };

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <View
          style={{
            flex: 1,
          }}>
          <AppUpdateHandler
            handle={requestAppUpdate}
            shouldUpdate={shouldUpdate}
          />
          <LoadingOverlay />
          <EmailLinkHandler />
          <RegisterDeviceToken />
          <OptionSheet />
          <IdTokenListener />
          {!shouldUpdate && <Main />}
        </View>
      </ThemeProvider>
    </StoreProvider>
  );
}
