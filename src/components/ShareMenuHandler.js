import React, {useEffect, useCallback} from 'react';
import {View} from 'react-native';
import ShareMenu from 'react-native-share-menu';
import {navigate, push} from '../navigation/Ref';
import analytics from '@react-native-firebase/analytics';

type SharedItem = {
  mimeType: string,
  data: string,
};

const ShareMenuHandler: () => React$Node = () => {
  const handleShare = useCallback((item: ?SharedItem) => {
    if (!item) {
      return;
    }
    analytics().logEvent('externalapp_sharefrom', {type: item.mimeType});

    push('CreatePost', {
      type: 'text',
      item: item,
    });
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

  return <View></View>;
};

export default ShareMenuHandler;
