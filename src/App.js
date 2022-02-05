import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import store from './redux/reducers/index';
import {utils} from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import {firebase} from '@react-native-firebase/perf';
import crashlytics from '@react-native-firebase/crashlytics';
import {getData} from './localStorage/helpers';
import {getRegistrationStatus} from './redux/reducers/AuthSlice';
import RealApp from './RealApp';
import ThemedAppIntroSlider from './ThemedAppIntroSlider';
import '../assets/i18n/i18n';

export default function App() {
  //function to disable GA/Crashytics & Firebase perf while running in Firebase testlab after submitting for publishing
  // also check whether user has done app intro tutorial
  const [introDone, setIntroDone] = useState(true);

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

  function IntroVsApp() {
    const isRegistered = useSelector(getRegistrationStatus);

    return isRegistered ? (
      introDone ? (
        <RealApp />
      ) : (
        <ThemedAppIntroSlider setIntroDone={setIntroDone} />
      )
    ) : (
      <RealApp />
    );
  }

  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <IntroVsApp />
      </SafeAreaProvider>
    </StoreProvider>
  );
}
