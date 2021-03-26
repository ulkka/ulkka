import React, {useEffect} from 'react';
import {View, Linking} from 'react-native';

export default function LinkHandler(props) {
  const getInitialLink = async () => {
    const url = await Linking.getInitialURL();
    console.log('initial url linking', url);
  };

  useEffect(() => {
    console.log('linkinghandling in linkhandler');
    getInitialLink();
    const onReceiveURL = ({url}: {url: string}) => {
      console.log('on recieve url in link handler comp', url);
      listener(url);
    };
    Linking.addEventListener('url', onReceiveURL);
    // Next, you would need to subscribe to incoming links from your third-party integration
    // For example, to get to subscribe to incoming links from branch.io:
    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
    };
  }, []);

  return <View></View>;
}
