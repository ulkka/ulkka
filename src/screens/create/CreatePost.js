import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import mainClient from '../../client/mainClient';
import {Input, Icon, Button} from 'react-native-elements';
import SearchableDropdown from '../../components/SearchableDropdown';
import Video from 'react-native-video';
import FormData from 'form-data';
import ImagePicker from 'react-native-image-crop-picker';
import LoadingOverlay from '../../components/LoadingOverlay';
import SubmitStatus from '../../components/SubmitStatus';

export default function CreatePost({navigation, route}) {
  const [type, setType] = useState('');
  const [community, setCommunity] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState({});
  const [link, setLink] = useState('');
  const [preview, setPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [
    selectCommunityModalVisible,
    setSelectCommunityModalVisible,
  ] = useState(false);

  useEffect(() => {
    setType(route.params.type);
  }, []);

  useEffect(() => {
    getOgPreview(link);
  }, [link]);

  const getOgPreview = async (link) => {
    setPreview(false);
    setPreviewData(null);
    console.log(link);
    const client = await mainClient;
    client
      .post('utility/ogPreview', {
        url: link,
      })
      .then((response) => {
        console.log('Preview response - ', response.data);
        if (response.data.ogImage.url === undefined) {
          setPreviewData(null);
        } else {
          setPreviewData(response.data);
          setPreview(true);
        }
      })
      .catch((error) => {
        setPreview(false);
        setPreviewData(null);
        console.log('Preview error - ', error);
      });
  };

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

  const submit = async () => {
    setLoading(true);

    const client = await mainClient;
    console.log('Uploading post type - ', type);

    switch (type) {
      case 'text':
        client
          .post('post', {
            community: community._id,
            title: title,
            description: description,
            type: type,
          })
          .then((response) => {
            setLoading(false);
            var status = {
              type: 'success',
              message: 'Successfully Posted to',
              entity: community.name,
            };
            setStatusData(status);
            setTimeout(() => navigation.navigate('Feed'), 2000);
          })
          .catch((error) => {
            console.log('Posting to server error - ', error);
            setLoading(false);
            var status = {
              type: 'fail',
              message: 'Failed to post to',
              entity: community.name,
            };
            setStatusData(status);
            setTimeout(navigation.navigate('Feed'), 2000);
          });
        return;
      case 'link':
        client
          .post('post', {
            community: community._id,
            title: title,
            link: link,
            type: type,
          })
          .then((response) => {
            setLoading(false);
            var status = {
              type: 'success',
              message: 'Successfully Posted to',
              entity: community.name,
            };
            setStatusData(status);
            setTimeout(() => navigation.navigate('Feed'), 2000);
          })
          .catch((error) => {
            console.log('Posting to server error - ', error);
            setLoading(false);
            var status = {
              type: 'fail',
              message: 'Failed to post to',
              entity: community.name,
            };
            setStatusData(status);
            setTimeout(navigation.navigate('Feed'), 2000);
          });
        return;

      case 'gif':
      case 'video':
      case 'image':
        var data = new FormData();
        console.log('uploading media from path - ', media.path);
        data.append('file', {
          uri:
            Platform.OS === 'android'
              ? media.path
              : media.path.replace('file://', ''),
          type: media.mime,
          name: media.filename,
        });

        client
          .post('media/post/upload', data)
          .then((response) => {
            console.log('Uploaded to cloudinary - ', response.data);
            console.log('Posting to server');
            client
              .post('post', {
                community: community._id,
                title: title,
                link: response.data.secure_url,
                type: type,
                mediaMetadata: response.data,
              })
              .then((response) => {
                console.log('Successfully Posted to server - ', response);
                setLoading(false);
                var status = {
                  type: 'success',
                  message: 'Successfully Posted to',
                  entity: title,
                };
                setStatusData(status);
                setTimeout(() => navigation.navigate('Feed'), 2000);
              })
              .catch((error) => {
                console.log('Posting to server error - ', error);
                setLoading(false);
                var status = {
                  type: 'fail',
                  message: 'Failed to post to',
                  entity: title,
                };
                setStatusData(status);
                setTimeout(navigation.navigate('Feed'), 2000);
              });
          })
          .catch((error) => {
            console.log('Media Upload Error - ', error);
            setLoading(false);
            var status = {
              type: 'fail',
              message: 'Failed to post to',
              entity: title,
            };
            setStatusData(status);
            setTimeout(navigation.navigate('Feed'), 1000);
          });
    }
  };

  const ViewTitle = (
    <View
      style={{
        flex: 1,
        height: 40,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 16, fontWeight: 'bold', color: '#444'}}>
        Create Post
      </Text>
    </View>
  );

  const SelectCommunityField = (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={() => setSelectCommunityModalVisible(true)}
        style={{
          height: 50,
          width: '95%',
          alignSelf: 'center',
          marginBottom: 50,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Text style={{color: '#555', fontSize: 18, fontWeight: 'bold'}}>
            {community == null ? 'Select Community' : community.name}
          </Text>
          <Icon
            name="angle-down"
            size={18}
            color="#333"
            type="font-awesome-5"
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  const PostTitleField = (
    <View style={{flex: 1}}>
      <Input
        style={{
          height: 40,
        }}
        inputContainerStyle={{
          borderBottomColor: '#ddd',
        }}
        onChangeText={(text) => setTitle(text)}
        value={title}
        placeholder={'Title'}
      />
    </View>
  );

  const DescriptionField = (
    <View style={{flex: 3}}>
      <Input
        style={{
          maxHeight: 300,
          minHeight: 150,
        }}
        inputContainerStyle={{
          borderBottomColor: '#fff',
        }}
        onChangeText={(text) => setDescription(text)}
        value={description}
        placeholder={'Description'}
        numberOfLines={10}
        multiline={true}
        maxLength={1000}
      />
    </View>
  );

  const PreviewField = (
    <View
      style={{
        backgroundColor: '#fff',
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
      }}>
      <View
        style={{
          flex: 7,
          justifyContent: 'center',
          padding: 5,
        }}>
        <View style={{margin: 5}}>
          <Text style={{fontWeight: 'bold', fontSize: 13, color: '#333'}}>
            {previewData == null ? '' : previewData.ogTitle}
          </Text>
        </View>
        <View style={{marginHorizontal: 5}}>
          <Text style={{fontSize: 11, color: '#555'}}>
            {previewData == null ? '' : previewData.ogDescription}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 5,
          padding: 5,
          alignItems: 'flex-start',
        }}>
        <Image
          source={{uri: previewData == null ? '' : previewData.ogImage.url}}
          style={{
            height: 180,
            aspectRatio: 1,
            maxWidth: 160,
            resizeMode: 'contain',
          }}
        />
      </View>
    </View>
  );

  const LinkField = (
    <View style={{flex: 3}}>
      <ScrollView>
        <View>
          <Input
            style={{
              maxHeight: 300,
              minHeight: 50,
            }}
            inputContainerStyle={{
              borderBottomColor: '#fff',
            }}
            onChangeText={(text) => setLink(text)}
            value={link}
            placeholder={'Add Link'}
            numberOfLines={2}
            multiline={true}
            maxLength={1000}
          />
        </View>
        {preview ? PreviewField : <View></View>}
      </ScrollView>
    </View>
  );

  const MediaField = (mediaType) => {
    return (
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {media == null ? (
          <TouchableOpacity onPress={() => pickMedia(mediaType)}>
            <Icon
              name="plus-square"
              size={40}
              reverse
              color="lightblue"
              type="font-awesome"
            />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#eee',
              width: Math.ceil((media.width * 250) / media.height),
              height: 250,
            }}>
            {mediaType == 'video' ? (
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
            ) : mediaType == 'photo' ? (
              <Image
                source={{uri: media.path}}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            ) : (
              <View></View>
            )}
            <TouchableOpacity
              onPress={() => setMedia(null)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
              }}>
              <Icon
                name="close"
                type="font-awesome"
                size={16}
                color="lightblue"
                reverse
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const PostDetail = (
    <View style={{flex: 6}}>
      <SearchableDropdown
        selectCommunityModalVisible={selectCommunityModalVisible}
        setSelectCommunityModalVisible={setSelectCommunityModalVisible}
        setCommunity={setCommunity}
      />
      {SelectCommunityField}
      <View style={{flex: 6}}>
        {PostTitleField}
        {type == 'text' ? (
          DescriptionField
        ) : type == 'image' || type == 'gif' ? (
          MediaField('photo')
        ) : type == 'video' ? (
          MediaField('video')
        ) : type == 'link' ? (
          LinkField
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );

  const PostButton = (
    <View
      style={{
        flex: 1,
        width: '40%',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Button
        icon={
          <Icon name="send" size={15} color={'green'} type="font-awesome" />
        }
        raised
        title="Post"
        buttonStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
          borderColor: '#ddd',
          //padding:20
        }}
        titleStyle={{
          color: 'green',
          fontWeight: 'bold',
          paddingLeft: 20,
        }}
        type="solid"
        //  disabled={true}
        onPress={() => submit()}
      />
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
      {ViewTitle}
      {PostDetail}
      {PostButton}
    </KeyboardAvoidingView>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      {createPostComponent}
      <LoadingOverlay visible={loading} />
      <SubmitStatus data={statusData} />
    </View>
  );
}
