import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, Linking, Alert, Platform} from 'react-native';
import {Icon, Button, Avatar, ThemeContext} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import analytics from '@react-native-firebase/analytics';
import utilityApi from '../../services/UtilityApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateCommunityFields,
  getCommunityField,
} from '../../redux/reducers/CommunitySlice';
import Snackbar from 'react-native-snackbar';
import {goBack} from '../../navigation/Ref';
import {
  showOverlay,
  hideOverlay,
} from '../../redux/reducers/LoadingOverlaySlice';

export default function ChangeCommunityIcon(props) {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();
  const {communityId, field} = props.route.params;

  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState(null);

  const mediaType = 'photo';

  const validateMedia = (media, postType) => {
    const {mime: mimeType, size} = media;
    const type = mimeType.split('/')[0];
    const format = mimeType.split('/')[1];
    if (postType == 'gif' && format != 'gif') {
      Snackbar.show({
        text:
          'Selected file is not a GIF. Please select a GIF file smaller than 10MB',
        duration: Snackbar.LENGTH_LONG,
      });
      analytics().logEvent('media_invalid', {
        type: type,
        reason: 'format_not_gif',
      });
      return false;
    }
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

  const pickMedia = mediaType => {
    ImagePicker.openPicker({
      writeTempFile: false,
      mediaType: mediaType,
      cropping: true,
      cropperCircleOverlay: true,
      cropperToolbarTitle: '',
    })
      .then(media => {
        // since ios and android responses are different and to accomodate gifs
        const isMediaValid = validateMedia(media, 'image');
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
      .catch(error => {
        console.error(error);

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

        Alert.alert(
          title,
          message,
          [
            {
              text: 'Cancel',
              onPress: () => {
                analytics().logEvent('mediapermission_deny');
                console.error('Cancel Pressed');
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
          ],
          {cancelable: true},
        );
      });
  };

  const selectMediaButton = (
    <TouchableOpacity
      hitSlop={{top: 75, bottom: 100, left: 100, right: 100}}
      onPress={() => pickMedia('photo')}>
      <Icon
        name="plus-square"
        size={40}
        reverse
        color={theme.colors.blue}
        type="font-awesome"
      />
    </TouchableOpacity>
  );

  const mediaImage = media ? (
    <Avatar
      rounded
      size={250}
      source={{
        uri: media.path,
      }}
    />
  ) : null;

  const close = (
    <TouchableOpacity
      onPress={() => setMedia(null)}
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

  const showSelectedMedia = media ? (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        maxHeight: 300,
        marginBottom: 15,
      }}>
      {mediaType == 'photo' && mediaImage}
      {close}
    </View>
  ) : null;

  function fileFormDataCreator() {
    if (!media || !media?.path || !media?.mime || !media?.filename) {
      return false;
    }
    var data = new FormData();
    data.append('file', {
      uri:
        Platform.OS === 'android'
          ? media.path
          : media.path.replace('file://', ''),
      type: media.mime,
      name: media.filename,
    });
    return data;
  }

  const submit = async () => {
    setLoading(true);
    dispatch(showOverlay());
    var data = fileFormDataCreator();
    if (data) {
      const response = await utilityApi.media.upload(data, null, null, 'image');
      const {secure_url} = response.data;
      if (secure_url) {
        await dispatch(
          updateCommunityFields({
            communityId,
            field: 'icon',
            value: secure_url,
          }),
        );
        setTimeout(
          () =>
            Snackbar.show({
              text: 'Community Icon Updated',
              duration: Snackbar.LENGTH_SHORT,
            }),
          100,
        );
        setLoading(false);
        dispatch(hideOverlay());
        goBack();
      } else
        Snackbar.show({
          text: 'Error updating community icon. Please try again',
          duration: Snackbar.LENGTH_SHORT,
        });
    }
    setLoading(false);
    dispatch(hideOverlay());
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      {media == null ? selectMediaButton : showSelectedMedia}
      <Button
        raised
        title="Submit"
        containerStyle={{width: 100, alignSelf: 'center'}}
        buttonStyle={{
          backgroundColor: theme.colors.blue,
          borderRadius: 15,
          paddingHorizontal: 20,
        }}
        titleStyle={{color: theme.colors.primary, fontSize: 14}}
        onPress={submit}
      />
    </View>
  );
}
