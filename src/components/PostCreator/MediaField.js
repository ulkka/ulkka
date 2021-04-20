import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';
import Snackbar from 'react-native-snackbar';
import analytics from '@react-native-firebase/analytics';

const validateMedia = (media) => {
  const {mime: mimeType, size} = media;
  const type = mimeType.substring(0, mimeType.indexOf('/'));
  if (type == 'image') {
    if (size > 10000000) {
      Snackbar.show({
        text: 'Please select an image with size lesser than 10MB',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('media_invalid', {
        type: type,
        reason: 'size_greaterthan_10MB',
      });
      return false;
    }
  }
  if (type == 'video') {
    if (size > 10000000) {
      Snackbar.show({
        text: 'Please select a video with size lesser than 10MB',
        duration: Snackbar.LENGTH_SHORT,
      });
      analytics().logEvent('media_invalid', {
        type: type,
        reason: 'size_greaterthan_10MB',
      });
      return false;
    }
  }
  return true;
};

export const MediaField = (props) => {
  const {mediaType, media, resetMedia, setMedia} = props;

  const pickMedia = (mediaType) => {
    ImagePicker.openPicker({
      writeTempFile: false,
      mediaType: mediaType,
    })
      .then((media) => {
        // since ios and android responses are different and to accomodate gifs
        console.log('Selected Media - ', media);
        const isMediaValid = validateMedia(media);
        if (isMediaValid) {
          if ('filename' in media) {
            let fileFormat = media.filename.split('.').pop();
            if (
              (fileFormat == 'gif' || fileFormat == 'GIF') &&
              media.mime == 'image/jpeg'
            ) {
              media.mime = 'image/gif';
              media.path = media.sourceURL;
            }
          }
          let filename = media.path.substring(
            media.path.lastIndexOf('/') + 1,
            media.path.length,
          );
          media.filename = filename;
          setMedia(media);
        }
      })
      .catch((error) => {
        console.log(error);

        if (error.message == 'User cancelled image selection') {
          return;
        }
        const title =
          Platform.OS == 'ios'
            ? 'Please allow access to your Photos'
            : 'Please allow access to your Media Library';
        const message =
          Platform.OS == 'ios'
            ? 'This allows Ulkka to share media from your library'
            : 'This allows Ulkka to share media from your library. Kindly enable Permissions->Storage in the application settings';
        const settingsTitle =
          Platform.OS == 'ios' ? 'Enable Library Access' : 'Go to Settings';

        analytics().logEvent('mediapermission_unavailable');

        Alert.alert(title, message, [
          {
            text: 'Cancel',
            onPress: () => {
              analytics().logEvent('mediapermission_deny');
              console.log('Cancel Pressed');
            },
            style: 'cancel',
          },
          {
            text: settingsTitle,
            onPress: () => {
              analytics().logEvent('mediapermission_settingsenable');
              Linking.openSettings();
            },
            style: 'default',
          },
        ]);
      });
  };

  const close = (
    <TouchableOpacity
      onPress={resetMedia}
      style={{
        position: 'absolute',
        top: 0,
        right: 10,
      }}>
      <Icon
        name="close"
        type="font-awesome"
        size={16}
        color="lightblue"
        reverse
      />
    </TouchableOpacity>
  );

  const mediaVideo = media ? (
    <Video
      style={{
        aspectRatio: 1,
        height: '100%',
      }}
      source={{uri: media.path}}
      resizeMode="contain"
      paused={false}
      showPoster={true}
      playWhenInactive={false}
      muted={true}
      repeat={true}
    />
  ) : null;

  const mediaImage = media ? (
    <Image
      source={{uri: media.path}}
      style={{
        aspectRatio: 1,
        height: '100%',
        resizeMode: 'contain',
      }}
    />
  ) : null;

  const selectMediaButton = (
    <TouchableOpacity
      hitSlop={{top: 75, bottom: 100, left: 100, right: 100}}
      onPress={() => pickMedia(mediaType)}>
      <Icon
        name="plus-square"
        size={40}
        reverse
        color="lightblue"
        type="font-awesome"
      />
    </TouchableOpacity>
  );

  const showSelectedMedia = media ? (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        aspectRatio: 1,
        maxHeight: 300,
        marginBottom: 15,
      }}>
      {mediaType == 'video' ? (
        mediaVideo
      ) : mediaType == 'photo' ? (
        mediaImage
      ) : (
        <View></View>
      )}
      {close}
    </View>
  ) : null;

  return (
    <View
      style={{
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {media == null ? selectMediaButton : showSelectedMedia}
    </View>
  );
};
