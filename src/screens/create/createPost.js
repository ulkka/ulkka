import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, Image} from 'react-native';
import mainClient from '../../client/mainClient';
import {Input} from 'react-native-elements';

import ImagePicker from 'react-native-image-crop-picker';

export default function createPost({navigation, route}) {
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [community, setCommunity] = useState('');
  const [text, setText] = useState('');
  const [avatarSource, setAvatarSource] = useState('');

  useEffect(() => {
    console.log(route.params.type);
  }, []);

  const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const imageUpload = () => {
    ImagePicker.openPicker({
      //   width: 300,
      //   height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((image) => {
      console.log(image);
    });
  };

  const submit = async () => {
    const client = await mainClient;
    client
      .post('post', {
        community: community,
        text: text,
        slug: slug,
        type: type,
        author: {
          user_id: userId,
          name: name,
        },
      })
      .then((response) => {
        console.log('response is', response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        width: '98%',
        alignSelf: 'center',
      }}>
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
      <View style={{flex: 3}}>
        <Input
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => setCommunity(text)}
          value={community}
          placeholder={'Community'}
        />
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => setText(text)}
          value={text}
          placeholder={'Title'}
        />
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => setText(text)}
          value={text}
          placeholder={'Description'}
        />
        <View>
          <Button title="Image Upload" onPress={() => imageUpload()} />
        </View>

        <View>
          <Button title="Submit" onPress={() => submit()} />
        </View>
      </View>
    </View>
  );
}
