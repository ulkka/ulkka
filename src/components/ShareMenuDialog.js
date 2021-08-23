import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ShareMenuReactView} from 'react-native-share-menu';

const ShareMenuDialog = () => {
  useEffect(() => {
    ShareMenuReactView.data().then(() => {
      ShareMenuReactView.continueInApp();
    });
  }, []);

  return <View></View>;
};

export default ShareMenuDialog;

//https://github.com/meedan/react-native-share-menu/blob/master/API_DOCS.md
