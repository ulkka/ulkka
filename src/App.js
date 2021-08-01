import React, {useEffect, useState} from 'react';
import {View, Platform} from 'react-native';
import Main from './navigation/Main';
import SplashScreen from 'react-native-splash-screen';
import {Provider as StoreProvider} from 'react-redux';
import store from './redux/reducers/index';
import {ThemeProvider} from 'react-native-elements';
import theme from './theme/main';
import LoadingOverlay from './components/LoadingOverlay';
import RegisterDeviceToken from './components/RegisterDeviceToken';
//import ShareMenuHandler from './components/ShareMenuHandler';
import AuthIDTokenListener from './client/AuthIDTokenListener';
import AppMaintenanceHandler from './components/AppMaintenanceHandler';
import {utils} from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import {firebase} from '@react-native-firebase/perf';
import crashlytics from '@react-native-firebase/crashlytics';
import CacheManagement from './components/CacheManagement';
import AppIntroSlider from './components/AppIntroSliderView';
import {getData} from './localStorage/helpers';

export default function App() {
  const [maintenance, setMaintenance] = useState(false);
  const [introDone, setIntroDone] = useState(true);
  //function to disable GA/Crashytics & Firebase perf while running in Firebase testlab after submitting for publishing
  // also check whether user has done app intro tutorial
  async function bootstrap() {
    const appInstanceId = await analytics().getAppInstanceId();
    console.log('appinstanceid', appInstanceId);
    if ((await utils().isRunningInTestLab) || __DEV__) {
      console.log('debug mode or running in firebase testlab');
      await analytics()
        .logEvent('test_work')
        .then(() => console.log('tested work'))
        .catch((error) => console.log('error testing event', error));
      // await analytics().setAnalyticsCollectionEnabled(false);
      await firebase.perf().setPerformanceCollectionEnabled(false);
      await crashlytics().setCrashlyticsCollectionEnabled(false);
    }

    const introStatus = await getData('introDone');
    if (introStatus === null) {
      setIntroDone(false);
    }
  }

  useEffect(() => {
    bootstrap();
    SplashScreen.hide();
  }, []);

  const toggleMaintenance = (value) => {
    setMaintenance(value);
  };

  const RealApp = (
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
          <AuthIDTokenListener />
          <CacheManagement />
          {!maintenance && <Main />}
          <RegisterDeviceToken />
        </View>
      </ThemeProvider>
    </StoreProvider>
  );
  return introDone ? RealApp : <AppIntroSlider setIntroDone={setIntroDone} />;
  //return RealApp;
}
