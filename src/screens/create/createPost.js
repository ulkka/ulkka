import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import mainClient from '../../client/mainClient';
import {Input, Icon, Button} from 'react-native-elements';
import SearchableDropdown from '../../components/SearchableDropdown';
import Video from 'react-native-video';
import FormData from 'form-data';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';

export default function createPost({navigation, route}) {
  const [type, setType] = useState('');
  const [community, setCommunity] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const [
    selectCommunityModalVisible,
    setSelectCommunityModalVisible,
  ] = useState(false);

  useEffect(() => {
    setType(route.params.type);
  }, []);

  const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const pickMedia = (mediaType) => {
    ImagePicker.openPicker({
      writeTempFile: false,
      mediaType: mediaType,
    })
      .then((media) => {
        // since ios and android responses are different and to accomodate gifs
        if ('filename' in media) {
          let fileFormat = media.filename.split('.').pop();
          if (
            (fileFormat == 'gif' || fileFormat == 'GIF') &&
            media.mime == 'image/jpeg'
          ) {
            media.path = media.sourceURL;
          }
        }
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
            setSubmitStatus('success');
            setTimeout(() => navigation.navigate('Home'), 5000);
          })
          .catch((error) => {
            setLoading(false);
            setSubmitStatus('fail');
            setTimeout(navigation.navigate('Home'), 1000);
          });
        return;
      case 'image':
        const fs = RNFetchBlob.fs;
        var data = new FormData();
        console.log('uploading media from path - ', media.path);
        data.append('file', {
          uri: media.path,
          type: 'image/jpeg',
          name: media.filename,
        });

        client
          .post('media/post/upload', data)
          .then((response) => {
            console.log('Uploaded to cloudinary - ', response.data.secure_url);
            console.log('Posting to server');
            client
              .post('post', {
                community: community._id,
                title: title,
                link: response.data.secure_url,
                type: type,
              })
              .then((response) => {
                console.log(response);
                setLoading(false);
                setSubmitStatus('success');
                //setTimeout(() => navigation.navigate('Home'), 5000);
              })
              .catch((error) => {
                console.log(error)
                setLoading(false);
                setSubmitStatus('fail');
                //setTimeout(navigation.navigate('Home'), 1000);
              });
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            setSubmitStatus('fail');
            setTimeout(navigation.navigate('Home'), 1000);
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
      <KeyboardAvoidingView style={{flex: 6}}>
        {PostTitleField}
        {type == 'text' ? (
          DescriptionField
        ) : type == 'image' || type == 'gif' ? (
          MediaField('photo')
        ) : type == 'video' ? (
          MediaField('video')
        ) : (
          <View></View>
        )}
      </KeyboardAvoidingView>
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

  const postSuccessComponent = (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Icon name="check-circle" size={100} type="font-awesome5" color="green" />
      <Text style={{fontSize: 20, fontWeight: 'bold', paddingTop: 50}}>
        Successfully Posted to
      </Text>
      <Text style={{fontSize: 20, fontWeight: 'bold', paddingTop: 10}}>
        {community == null ? '' : community.name}
      </Text>
    </View>
  );
  const postFailComponent = (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Icon name="error" size={100} color="red" />
      <Text style={{fontSize: 20, fontWeight: 'bold', padding: 50}}>
        Failed to Post to
      </Text>
      <Text style={{fontSize: 20, fontWeight: 'bold', paddingTop: 10}}>
        {community == null ? '' : community.name}
      </Text>
    </View>
  );

  const createPostComponent = (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        width: '98%',
        alignSelf: 'center',
      }}>
      {ViewTitle}
      {PostDetail}
      {PostButton}
    </View>
  );

  return !loading ? (
    submitStatus == '' ? (
      createPostComponent
    ) : submitStatus == 'success' ? (
      postSuccessComponent
    ) : (
      postFailComponent
    )
  ) : (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  );
}
