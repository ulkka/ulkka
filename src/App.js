import React, {useEffect, useState} from 'react';
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
import AuthIDTokenListener from './client/AuthIDTokenListener';
import AppMaintenanceHandler from './components/AppMaintenanceHandler';
import {utils} from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import {firebase} from '@react-native-firebase/perf';
import crashlytics from '@react-native-firebase/crashlytics';

export default function App() {
  const [maintenance, setMaintenance] = useState(false);

  //function to disable GA/Crashytics & Firebase perf while running in Firebase testlab after submitting for publishing
  async function bootstrap() {
    if (utils().isRunningInTestLab || __DEV__) {
      console.log('debug mode or running in firebase testlab');
      await analytics().setAnalyticsCollectionEnabled(false);
      await firebase.perf().setPerformanceCollectionEnabled(false);
      await crashlytics().setCrashlyticsCollectionEnabled(false);
    }
  }

  useEffect(() => {
    bootstrap();
    SplashScreen.hide();
  }, []);

  const toggleMaintenance = (value) => {
    setMaintenance(value);
  };

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <View
          style={{
            flex: 1,
          }}>
          <AppMaintenanceHandler
            handle={toggleMaintenance}
            maintenance={maintenance}
          />
          <LoadingOverlay />
          <EmailLinkHandler />
          <RegisterDeviceToken />
          <AuthIDTokenListener />
          {!maintenance && <Main />}
        </View>
      </ThemeProvider>
    </StoreProvider>
  );
}
