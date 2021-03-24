import React, {useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import SearchableDropdown from '../../components/SearchableDropdown';
import FormData from 'form-data';
import ShowSubmitStatus from '../../components/PostCreator/ShowSubmitStatus';
import {navigate} from '../../navigation/Ref';
import {useDispatch} from 'react-redux';
import {createPost} from '../../redux/actions/PostActions';
import {PostTitleField} from '../../components/PostCreator/PostTitleField';
import {DescriptionField} from '../../components/PostCreator/DescriptionField';
import {Title} from '../../components/PostCreator/Title';
import {SubmitButton} from '../../components/PostCreator/SubmitButton';
import {MediaField} from '../../components/PostCreator/MediaField';
import {LinkField} from '../../components/PostCreator/LinkField';
import {CommunityField} from '../../components/PostCreator/CommunityField';
import utilityApi from '../../services/UtilityApi';
import {
  uploadProgress,
  ShowSubmitProgress,
} from '../../components/PostCreator/UploadProgress';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';

export default function CreatePost({route}) {
  const dispatch = useDispatch();

  const item = route?.params?.item;
  let postType = route?.params?.type ? route.params.type : 'text';

  const [type, setType] = useState(postType);
  const [community, setCommunity] = useState(null);
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

  const getTypeFromMime = (mimeType) => {
    return mimeType.substring(mimeType.lastIndexOf('/') + 1) == 'gif'
      ? 'gif'
      : mimeType.substring(0, mimeType.indexOf('/'));
  };

  const getLinkFromText = (text) => {
    return text.indexOf('https://') == 0
      ? text.substring(
          0,
          text.indexOf(' ') == -1 ? text.length : text.indexOf(' '),
        )
      : '';
  };

  useEffect(() => {
    if (item) {
      console.log('shared item', item);
      handleSharedItem(item);
    }
  }, [item]);

  function handleSharedItem(item) {
    const {data, mimeType} = item;
    const type = getTypeFromMime(mimeType);
    console.log('type', type);
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
        console.log('link', link);
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

  const showSnackBar = (message) => {
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
        10,
      );
    }
  };

  const postSuccess = () => {
    setLoading(false);
    var status = {
      type: 'success',
      message: 'Successfully Posted to',
      entity: community.name,
    };
    setStatusData(status);
    setUploadPercent(0);
    setTimeout(() => navigate('Feed'), 2000);
  };

  const postFail = (error) => {
    console.log('Posting to server error - ', error);
    setUploadPercent(0);
    setLoading(false);
    showSnackBar('Request failed. Please try again later');
  };

  const uploadCancelled = (error) => {
    console.log('Media Upload Cancelled - ', error);
    setLoading(false);
    setUploadPercent(0);
    showSnackBar('Upload Cancelled');
  };

  const payloadCreator = (type, response) => {
    let payload = {};
    switch (type) {
      case 'text':
        payload = {
          community: community?._id,
          title: title,
          description: description,
          type: type,
        };
        return payload;
      case 'link':
        payload = {
          community: community?._id,
          title: title,
          link: link,
          type: type,
        };
        return payload;
      case 'gif':
      case 'video':
      case 'image':
        payload = {
          community: community?._id,
          title: title,
          link: response?.data?.secure_url,
          type: type,
          mediaMetadata: response?.data,
        };
        return payload;
    }
  };

  const payloadValidator = (payload, type) => {
    const {community, title, description, link, mediaMetadata} = payload;
    switch (type) {
      case 'text':
        if (!community) {
          showSnackBar('Please select a valid community');
          return false;
        }
        if (!title) {
          showSnackBar('Please add a title for the post');
          return false;
        }
        if (!description) {
          showSnackBar('Please add a description for the post');
          return false;
        }
        return true;
      case 'link':
        if (!community) {
          showSnackBar('Please select a valid community');
          return false;
        }
        if (!title) {
          showSnackBar('Please add a title for the post');
          return false;
        }
        if (!link) {
          showSnackBar('Please add a link for the post');
          return false;
        }
        return true;
      case 'gif':
      case 'video':
      case 'image':
        if (!community) {
          showSnackBar('Please select a valid community');
          return false;
        }
        if (!title) {
          showSnackBar('Please add a title for the post');
          return false;
        }
        return true;
    }
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

  const dispatchPost = (payload) => {
    dispatch(createPost(payload))
      .then((response) => {
        postSuccess();
      })
      .catch((error) => {
        postFail(error);
      });
  };

  const submit = async () => {
    setLoading(true);
    console.log('Uploading post type - ', type);
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
        let prePayload = {type: type, title: title, community: community?._id};
        var data = fileFormDataCreator();
        isPayloadValid = payloadValidator(prePayload, type);
        if (isPayloadValid) {
          if (data) {
            console.log('uploading media ', media);
            let source = createNewAxiosClientSource();
            response = await utilityApi.media.upload(
              data,
              uploadProgress((percent) => setUploadPercent(percent)),
              source.token,
            );
            console.log('response after media upload', response);
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

  const postContent =
    type == 'text' ? (
      <DescriptionField
        onChangeText={(text) => setDescription(text)}
        description={description}
      />
    ) : type == 'image' || type == 'gif' ? (
      <MediaField
        mediaType="photo"
        media={media}
        resetMedia={() => setMedia(null)}
        setMedia={(media) => setMedia(media)}
      />
    ) : type == 'video' ? (
      <MediaField
        mediaType="video"
        media={media}
        resetMedia={() => setMedia(null)}
        setMedia={(media) => setMedia(media)}
      />
    ) : type == 'link' ? (
      <LinkField onChangeText={(text) => setLink(text)} link={link} />
    ) : (
      <View></View>
    );

  const PostDetail = (
    <View style={{flex: 6}}>
      <SearchableDropdown
        selectCommunityModalVisible={selectCommunityModalVisible}
        setSelectCommunityModalVisible={setSelectCommunityModalVisible}
        setCommunity={setCommunity}
      />
      <CommunityField
        onPress={() => setSelectCommunityModalVisible(true)}
        community={community}
      />
      <View style={{flex: 6}}>
        <PostTitleField onChangeText={(text) => setTitle(text)} title={title} />
        {postContent}
      </View>
    </View>
  );

  const createPostComponent = (
    <KeyboardAvoidingView
      keyboardVerticalOffset={95}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        width: '98%',
        alignSelf: 'center',
      }}>
      {Title}
      {PostDetail}
      <SubmitButton onPress={() => submit()} />
    </KeyboardAvoidingView>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
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
}
