import React, {useEffect} from 'react';
import {View} from 'react-native';
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

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <View
          style={{
            flex: 1,
          }}>
          <LoadingOverlay />
          <EmailLinkHandler />
          <RegisterDeviceToken />
          <OptionSheet />
          <IdTokenListener />
          <Main />
        </View>
      </ThemeProvider>
    </StoreProvider>
  );
}
