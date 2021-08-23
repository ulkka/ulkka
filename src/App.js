import React, {useEffect, useState} from 'react';
import {View, Appearance, StatusBar} from 'react-native';
import Main from './navigation/Main';
import SplashScreen from 'react-native-splash-screen';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import store from './redux/reducers/index';
import {ThemeProvider} from 'react-native-elements';
import {light, dark} from './theme/main';
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
import {getRegistrationStatus} from './redux/reducers/AuthSlice';

export default function App() {
  const [maintenance, setMaintenance] = useState(false);
  const [introDone, setIntroDone] = useState(true);
  const colorScheme = Appearance.getColorScheme();
  //function to disable GA/Crashytics & Firebase perf while running in Firebase testlab after submitting for publishing
  // also check whether user has done app intro tutorial
  async function bootstrap() {
    if ((await utils().isRunningInTestLab) || __DEV__) {
      await analytics().setAnalyticsCollectionEnabled(false);
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

  const toggleMaintenance = value => {
    setMaintenance(value);
  };

  const RealApp = () => {
    const isDark = true;
    const theme = isDark ? dark : light;

    return (
      <ThemeProvider theme={theme} useDark={isDark}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#111' : '#fefefe'}
        />
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
    );
  };

  function IntroVsApp() {
    const isRegistered = useSelector(getRegistrationStatus);

    return isRegistered ? (
      introDone ? (
        <RealApp />
      ) : (
        <AppIntroSlider setIntroDone={setIntroDone} />
      )
    ) : (
      <RealApp />
    );
  }

  return (
    <StoreProvider store={store}>
      <IntroVsApp />
    </StoreProvider>
  );
}
