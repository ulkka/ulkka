import React, {useEffect, useState} from 'react';
import {View, Platform, Text, Image, Keyboard} from 'react-native';
import {Button, useTheme} from 'react-native-elements';
import SearchableDropdown from '../../components/SearchableDropdown';
import {CommunityField} from '../../components/PostCreator/CommunityField';
import FormData from 'form-data';
import ShowSubmitStatus from '../../components/PostCreator/ShowSubmitStatus';
import {pop, push, showAuthScreen} from '../../navigation/Ref';
import {useSelector, useDispatch} from 'react-redux';
import {createPost} from '../../redux/actions/PostActions';
import {PostTitleField} from '../../components/PostCreator/PostTitleField';
import {DescriptionField} from '../../components/PostCreator/DescriptionField';
import {SubmitButton} from '../../components/PostCreator/SubmitButton';
import {MediaField} from '../../components/PostCreator/MediaField';
import {LinkField} from '../../components/PostCreator/LinkField';
import utilityApi from '../../services/UtilityApi';
import {
  uploadProgress,
  ShowSubmitProgress,
} from '../../components/PostCreator/UploadProgress';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';
import {
  isURLValid,
  removeEmptyLines,
} from '../../components/PostCreator/helpers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function CreatePost({route}) {
  const {theme} = useTheme();

  const dispatch = useDispatch();

  const isRegistered = useSelector(getRegistrationStatus);

  const {item} = route?.params;
  let postType = route?.params?.type ? route.params.type : 'text';
  const [postId, setPostId] = useState('');
  const [type, setType] = useState(postType);
  const [community, setCommunity] = useState(route?.params?.community);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState({});
  const [link, setLink] = useState('');
  const [uploadPercent, setUploadPercent] = useState(0);
  const [clientSource, setClientSource] = useState(0);

  const [
    selectCommunityModalVisible,
    setSelectCommunityModalVisible,
  ] = useState(false);

  const getTypeFromMime = mimeType => {
    return mimeType.substring(mimeType.lastIndexOf('/') + 1) == 'gif'
      ? 'gif'
      : mimeType.substring(0, mimeType.indexOf('/'));
  };

  const getLinkFromText = text => {
    return text.indexOf('https://') == 0
      ? text.substring(
          0,
          text.indexOf(' ') == -1 ? text.length : text.indexOf(' '),
        )
      : '';
  };

  useEffect(() => {
    if (item) {
      handleSharedItem(item);
    }
  }, [item]);

  function handleSharedItem(item) {
    const {data, mimeType} = item;
    const type = getTypeFromMime(mimeType);
    switch (type) {
      case 'image':
      case 'video':
      case 'gif':
        const filename = data.substring(data.lastIndexOf('/') + 1, data.length);
        const media = {
          mime: mimeType,
          path: data,
          filename: filename,
        };
        setType(type);
        setMedia(media);
        return;
      case 'text':
        const sharedText = item.data;
        const link = getLinkFromText(sharedText);
        if (link.length) {
          // checking if shared text is link
          setLink(link);
          setType('link');
        } else {
          setDescription(sharedText);
          setType(type);
        }
    }
  }

  const showSnackBar = message => {
    if (Platform.OS == 'ios') {
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      setTimeout(
        () =>
          Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
          }),
        100,
      );
    }
  };

  const postSuccess = newPostId => {
    setLoading(false);
    var status = {
      type: 'success',
      message: 'Successfully Posted to ',
      entity: community.name,
    };
    setStatusData(status);
    setUploadPercent(0);
    setTimeout(() => {
      pop();
      push('PostDetail', {postId: newPostId});
    }, 1000);
  };

  const postFail = error => {
    console.warn('Posting to server error - ', error);
    setUploadPercent(0);
    setLoading(false);
    showSnackBar('Request failed. Please try again later');
  };

  const uploadCancelled = error => {
    console.warn('Media Upload Cancelled - ', error);
    setLoading(false);
    setUploadPercent(0);
    showSnackBar('Upload Cancelled');
  };

  const payloadCreator = (type, response) => {
    let payload = {};
    payload.title = removeEmptyLines(title.trim());
    payload.type = type;
    payload.community = community;
    switch (type) {
      case 'text':
        payload.description = removeEmptyLines(description.trim());
        return payload;
      case 'link':
        payload.link = link.trim();
        return payload;
      case 'gif':
      case 'video':
      case 'image':
        payload.link = response?.data?.secure_url;
        payload.mediaMetadata = response?.data;
        return payload;
    }
  };

  const payloadValidator = (payload, type) => {
    const {community, title, description, link, mediaMetadata} = payload;
    if (!community?._id) {
      showSnackBar('Please select a valid community');
      return false;
    }
    if (!title) {
      showSnackBar('Please add a title for the post');
      return false;
    }
    switch (type) {
      case 'text':
        /* if (!description) {
          showSnackBar('Please add a description for the post');
          return false;
        }*/
        return true;
      case 'link':
        if (!link) {
          showSnackBar('Please add a link for the post');
          return false;
        } else {
          const isLinkValid = isURLValid(link);
          !isLinkValid && showSnackBar('Please enter a valid link');
          return isLinkValid;
        }
    }
    return true;
  };

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

  function createNewAxiosClientSource() {
    let source = axios.CancelToken.source();
    setClientSource(source);
    return source;
  }

  const dispatchPost = payload => {
    dispatch(createPost(payload))
      .then(response => {
        if (response.error) {
          postFail(response.error);
        } else {
          const newPostId = response.payload.newPostId;
          postSuccess(newPostId);
        }
      })
      .catch(error => {
        postFail(error);
      });
  };

  const submit = async () => {
    Keyboard.dismiss();
    if (!isRegistered) {
      showSnackBar('Please login to create posts');
      return;
    }
    setLoading(true);
    let response = {};
    let payload = {};
    let isPayloadValid = false;
    switch (type) {
      case 'text':
      case 'link':
        payload = payloadCreator(type);
        isPayloadValid = payloadValidator(payload, type);
        if (isPayloadValid) {
          dispatchPost(payload);
        } else {
          setLoading(false);
        }
        return;

      case 'gif':
      case 'video':
      case 'image':
        let prePayload = {
          type: type,
          title: title,
          community: community,
        };
        var data = fileFormDataCreator();
        isPayloadValid = payloadValidator(prePayload, type);
        if (isPayloadValid) {
          if (data) {
            let source = createNewAxiosClientSource();
            response = await utilityApi.media.upload(
              data,
              uploadProgress(percent => setUploadPercent(percent)),
              source.token,
              type,
            );
          } else {
            showSnackBar('Please select ' + type);
            setLoading(false);
            return;
          }
        } else {
          setLoading(false);
        }

        if (!(response.error || response?.data?.name == 'Error')) {
          payload = payloadCreator(type, response);
          if (isPayloadValid) {
            dispatchPost(payload);
          } else {
            setLoading(false);
          }
        } else {
          const error = response.error;
          if (response.type == 'mediaUploadCancelled') {
            uploadCancelled(error);
          } else {
            const error = response.error;
            postFail(error);
          }
        }
    }
  };

  const PostContentField = () => {
    switch (type) {
      case 'text':
        return (
          <DescriptionField
            onChangeText={text => setDescription(text)}
            description={description}
          />
        );
      case 'link':
        return (
          <LinkField
            onChangeText={text => setLink(text)}
            link={link}
            title={title}
            changeTitle={text => setTitle(text)}
          />
        );
      case 'image':
      case 'gif':
        return (
          <MediaField
            mediaType="photo"
            media={media}
            type={type}
            resetMedia={() => setMedia(null)}
            setMedia={media => setMedia(media)}
          />
        );
      case 'video':
        return (
          <MediaField
            mediaType="video"
            media={media}
            type={type}
            resetMedia={() => setMedia(null)}
            setMedia={media => setMedia(media)}
          />
        );

      default:
        <View></View>;
    }
  };

  const PostDetail = (
    <View
      style={{
        paddingTop: 20,
        flex: 1,
        justifyContent: 'space-evenly',
        //  borderWidth: 1,
      }}>
      <SearchableDropdown
        selectCommunityModalVisible={selectCommunityModalVisible}
        setSelectCommunityModalVisible={setSelectCommunityModalVisible}
        setCommunity={setCommunity}
      />
      <CommunityField
        onPress={() => setSelectCommunityModalVisible(true)}
        community={community}
      />
      <PostTitleField onChangeText={text => setTitle(text)} title={title} />
      {PostContentField()}
      <SubmitButton onPress={() => submit()} />
    </View>
  );

  const createPostComponent = (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{
        justifyContent: 'space-evenly',
        flexGrow: 1,
        paddingBottom: 10,
      }}>
      {PostDetail}
    </KeyboardAwareScrollView>
  );

  const handlePostCreation = (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}>
      {createPostComponent}
      <ShowSubmitStatus data={statusData} />
      <ShowSubmitProgress
        percent={uploadPercent}
        showUploadProgress={uploadPercent > 0 ? true : false}
        isVisible={loading}
        type={type}
        onCancel={() => clientSource.cancel('Upload cancelled by user')}
      />
    </View>
  );

  const requestLogin = (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <Text
        style={{fontSize: 16, fontWeight: 'bold', color: theme.colors.black5}}>
        Please login or create an account to create posts{'    '}
      </Text>
      <Button
        title="Join Ulkka!"
        titleStyle={{
          fontSize: 14,
          color: theme.colors.green,
          padding: 4,
          fontWeight: '600',
        }}
        buttonStyle={{
          backgroundColor: theme.colors.grey2,
          width: 150,
          borderRadius: 15,
        }}
        onPress={() => showAuthScreen()}
      />
    </View>
  );

  const loadingView = (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
      <Text
        style={{
          padding: 50,
          fontSize: 15,
          fontWeight: 'bold',
          color: theme.colors.black5,
        }}>
        {'  '}Loading...{'  '}
      </Text>
    </View>
  );

  return isRegistered === undefined
    ? loadingView
    : isRegistered == 1
    ? handlePostCreation
    : requestLogin;
}
