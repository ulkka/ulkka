import React, {useEffect} from 'react';
import {View} from 'react-native';
import RNFS from 'react-native-fs';

const cacheExpiryDurationSeconds = 345600;

export default function CacheManagement(props) {
  useEffect(() => {
    removeOldCacheFiles();
  }, []);

  const removeOldCacheFiles = async () => {
    const cachesDirectoryPath = RNFS.CachesDirectoryPath;
    const mediaCacheDirectoryPath = cachesDirectoryPath + '/media';

    const mediaCacheDirectoryItems = await RNFS.readDir(
      mediaCacheDirectoryPath,
    );
    mediaCacheDirectoryItems.map((item, index) => {
      var difference = Date.now() - item.mtime.getTime();
      console.log('item in cache', item);
      var secondsDifference = Math.floor(difference / 1000);

      if (secondsDifference > cacheExpiryDurationSeconds) {
        console.log(
          'deleting old cached file of expiry seconds',
          cacheExpiryDurationSeconds,
          item,
        );
        RNFS.unlink(item.path).catch((error) =>
          console.warn('file doesnt exist', error, item),
        );
      }
    });
  };

  return <View></View>;
}
