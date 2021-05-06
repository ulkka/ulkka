import React, {useEffect} from 'react';
import {View} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {
  requestTrackingPermission,
  getTrackingStatus,
} from 'react-native-tracking-transparency';
import {utils} from '@react-native-firebase/app';

export default function AppTrackingTransparencyIOS(props) {
  useEffect(() => {
    trackingTransparencyPermissionHandler();
  }, []);

  const trackingTransparencyPermissionHandler = async () => {
    if (!(utils().isRunningInTestLab || __DEV__)) {
      const trackingStatus = await getTrackingStatus();

      if (trackingStatus == 'not-determined') {
        const requestStatus = await requestTrackingPermission();
        if (requestStatus == 'authorized') {
          await analytics().setAnalyticsCollectionEnabled(true);
        }
      } else if (
        trackingStatus == 'authorized' ||
        trackingStatus === 'unavailable'
      ) {
        await analytics().setAnalyticsCollectionEnabled(true);
      } else if (trackingStatus == 'denied' || trackingStatus == 'restricted') {
        await analytics().setAnalyticsCollectionEnabled(false);
      }
    }
  };

  return <View></View>;
}
