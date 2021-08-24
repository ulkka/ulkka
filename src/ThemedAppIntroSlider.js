import React, {useEffect} from 'react';
import {StatusBar, Platform, AppState} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {ThemeProvider} from 'react-native-elements';
import {light, dark} from './theme/main';
import analytics from '@react-native-firebase/analytics';
import AppIntroSlider from './components/AppIntroSliderView';
import {loadTheme, getIsDark, getTheme} from './redux/reducers/ThemeSlice';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const ThemedAppIntroSlider = ({setIntroDone}) => {
  const dispatch = useDispatch();
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
      <AppIntroSlider setIntroDone={setIntroDone} />
    </ThemeProvider>
  );
};

export default ThemedAppIntroSlider;
