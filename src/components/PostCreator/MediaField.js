import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';

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
      })
      .catch((error) => {
        console.log(error);
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
        width: '100%',
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
      //source={{uri: 'content://media/external/file/604102'}}
      style={{
        width: '100%',
        aspectRatio: 1,
        // height: '100%',
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
        // width: Math.ceil((media.width * 250) / media.height),
        aspectRatio: 1,
        height: 300,
        resizeMode: 'contain',
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
