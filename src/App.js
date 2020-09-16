import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import Main from './navigation/Main';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Main />
    </SafeAreaView>
  );
}
