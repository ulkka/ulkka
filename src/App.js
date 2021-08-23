import React, {useEffect, useState} from 'react';
import {View, Appearance, StatusBar, Platform} from 'react-native';
import Main from './navigation/Main';
import SplashScreen from 'react-native-splash-screen';
import {Provider as StoreProvider, useSelector, useDispatch} from 'react-redux';
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
import {getTheme, loadTheme} from './redux/reducers/ThemeSlice';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const RealApp = () => {
  const dispatch = useDispatch();
  const [maintenance, setMaintenance] = useState(false);
  const toggleMaintenance = value => {
    setMaintenance(value);
  };

  const colorScheme = Appearance.getColorScheme();
  useEffect(() => {
    dispatch(loadTheme());
  }, []);
  const appTheme = useSelector(getTheme);
  const theme = appTheme == 'auto' ? colorScheme : appTheme;
  const themeObject = theme === 'dark' ? dark : light;
  const isDark = theme === 'dark';

  useEffect(() => {
    if (Platform.OS == 'android') changeNavBarColor();
  }, [appTheme]);

  const changeNavBarColor = async () => {
    try {
      await changeNavigationBarColor(isDark ? '#111111' : '#ffffff', !isDark);
    } catch (error) {
      console.error('error changing navbar color', error);
    }
  };

  return (
    <ThemeProvider theme={themeObject} useDark={isDark}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111' : '#fff'}
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

const ThemedAppIntroSlider = ({setIntroDone}) => {
  const dispatch = useDispatch();

  const colorScheme = Appearance.getColorScheme();
  useEffect(() => {
    dispatch(loadTheme());
  }, []);

  const appTheme = useSelector(getTheme);
  const theme = appTheme == 'auto' ? colorScheme : appTheme;
  const themeObject = theme === 'dark' ? dark : light;
  const isDark = theme === 'dark';

  return (
    <ThemeProvider theme={themeObject} useDark={isDark}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111' : '#fff'}
      />
      <AppIntroSlider setIntroDone={setIntroDone} />
    </ThemeProvider>
  );
};

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
      <IntroVsApp />
    </StoreProvider>
  );
}
