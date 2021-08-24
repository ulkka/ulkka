import React, {useEffect, useState} from 'react';
import {View, StatusBar, Platform, AppState} from 'react-native';
import Main from './navigation/Main';
import {useSelector, useDispatch} from 'react-redux';
import {ThemeProvider} from 'react-native-elements';
import {light, dark} from './theme/main';
import LoadingOverlay from './components/LoadingOverlay';
import RegisterDeviceToken from './components/RegisterDeviceToken';
import AuthIDTokenListener from './client/AuthIDTokenListener';
import AppMaintenanceHandler from './components/AppMaintenanceHandler';
import analytics from '@react-native-firebase/analytics';
import CacheManagement from './components/CacheManagement';
import {getRegistrationStatus} from './redux/reducers/AuthSlice';
import {loadTheme, getIsDark, getTheme} from './redux/reducers/ThemeSlice';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {fetchUnreadNotificationCount} from './redux/reducers/NotificationSlice';

const RealApp = () => {
  const dispatch = useDispatch();
  const [maintenance, setMaintenance] = useState(false);
  const toggleMaintenance = value => {
    setMaintenance(value);
  };

  const isRegistered = useSelector(getRegistrationStatus);

  const currentTheme = useSelector(getTheme);
  const isDark = useSelector(getIsDark);
  const themeObject = isDark ? dark : light;

  useEffect(() => {
    dispatch(loadTheme());
  }, []);

  useEffect(() => {
    const subscriber = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscriber(); // unsubscribe on unmount
  }, []);

  function handleAppStateChange(appState) {
    if (appState == 'active') {
      analytics().logAppOpen();
    }
    if (appState == 'active' && isRegistered) {
      dispatch(fetchUnreadNotificationCount());
    }
    if (currentTheme == 'auto' && appState == 'active') {
      dispatch(loadTheme());
    }
  }

  useEffect(() => {
    if (Platform.OS == 'android') changeNavBarColor();
  }, [isDark]);

  const changeNavBarColor = async () => {
    try {
      await changeNavigationBarColor(isDark ? '#111111' : '#ffffff', !isDark);
    } catch (error) {
      console.warn('error changing navbar color', error);
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

export default RealApp;
