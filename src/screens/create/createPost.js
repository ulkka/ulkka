import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import mainClient from '../../client/mainClient';
import {Input, Icon, Button} from 'react-native-elements';
import SearchableDropdown from '../../components/SearchableDropdown';

import ImagePicker from 'react-native-image-crop-picker';

export default function createPost({navigation, route}) {
  const [type, setType] = useState('');
  const [community, setCommunity] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState(null);

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

  const pickImage = () => {
    ImagePicker.openPicker({
      //cropping: true,
      // cropperCircleOverlay: true,
    }).then((image) => {
      console.log(image);
      setImage(image);
    });
  };

  const submit = async () => {
    const client = await mainClient;
    client
      .post('post', {
        community: community._id,
        title: title,
        description: description,
        type: type,
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
      <View style={{flex: 4}}>
        <SearchableDropdown
          selectCommunityModalVisible={selectCommunityModalVisible}
          setSelectCommunityModalVisible={setSelectCommunityModalVisible}
          setCommunity={setCommunity}
        />
        <TouchableOpacity
          onPress={() => setSelectCommunityModalVisible(true)}
          style={{
            // borderBottomWidth: 1,
            height: 50,
            width: '95%',
            alignSelf: 'center',
            marginBottom: 50,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Text
              style={{
                color: '#555',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
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
        <KeyboardAvoidingView>
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
          {type == 'text' ? (
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
          ) : type == 'image' ? (
            <View
              style={{
                height: 300,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {image == null ? (
                <TouchableOpacity onPress={() => pickImage()}>
                  <Icon
                    name="plus-square"
                    size={30}
                    reverse
                    color="lightblue"
                    type="font-awesome"
                  />
                </TouchableOpacity>
              ) : (
                <View style={{
                  flex:1,
                  width:"80%",
                  alignItems:"center",
                  justifyContent:"center"
                }}>
                  <ImageBackground
                    source={{uri: image.path}}
                    style={{
                      width: Math.ceil(image.width * 230 /image.height),
                      height: 230,
                      
                    }}
                    imageStyle={{
                      resizeMode: 'contain',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 2,
                        alignItems: 'flex-end',
                      }}>
                      <TouchableOpacity onPress={() => setImage(null)}>
                        <Icon
                          name="close"
                          type="font-awesome"
                          size={16}
                          color="lightblue"
                          reverse
                        />
                      </TouchableOpacity>
                    </View>
                  </ImageBackground>
                </View>
              )}
            </View>
          ) : (
            <View></View>
          )}
        </KeyboardAvoidingView>
        <View
          style={{
            width: '40%',
            alignSelf: 'center',
          }}>
          <Button
            icon={
              <Icon name="send" size={15} color="green" type="font-awesome" />
            }
            raised
            title="Post"
            buttonStyle={{
              backgroundColor: '#fff',
              borderRadius: 20,
              borderColor: '#ddd',
            }}
            titleStyle={{
              color: 'green',
              fontWeight: 'bold',
              paddingLeft: 20,
            }}
            type="solid"
            onPress={() => submit()}
          />
        </View>
      </View>
    </View>
  );
}
